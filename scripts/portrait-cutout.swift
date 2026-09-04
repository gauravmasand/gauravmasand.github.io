/*
 * portrait-cutout — lift a portrait subject off its background.
 *
 * macOS-only. Uses the Vision framework's foreground-instance segmentation
 * (the same "subject lifting" the system Photos app performs), then:
 *
 *   1. erodes and feathers the returned mask, which removes the one- or
 *      two-pixel halo of background colour that soft-matte edges always carry
 *      — the halo is invisible against the background it came from and very
 *      visible against any other one, which is the whole point here;
 *   2. crops to the alpha bounding box with a small margin, so the exported
 *      file is subject rather than mostly-empty canvas;
 *   3. scales to the requested width and writes a straight-alpha PNG.
 *
 * usage: portrait-cutout <in> <out.png> <target-width> [erode-px]
 */
import Foundation
import Vision
import CoreImage

func die(_ m: String) -> Never {
  FileHandle.standardError.write(("portrait-cutout: " + m + "\n").data(using: .utf8)!)
  exit(1)
}

let argv = CommandLine.arguments
guard argv.count >= 4, let targetW = Double(argv[3]) else {
  die("usage: portrait-cutout <in> <out.png> <target-width> [erode-px]")
}
let erode = argv.count > 4 ? (Double(argv[4]) ?? 2) : 2
let inURL = URL(fileURLWithPath: argv[1])
let outURL = URL(fileURLWithPath: argv[2])

guard let src = CIImage(contentsOf: inURL) else { die("cannot read \(inURL.path)") }

/* ── 1. subject mask ──────────────────────────────────────────────────── */

let handler = VNImageRequestHandler(url: inURL, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()
do { try handler.perform([request]) } catch { die("vision request failed: \(error)") }
guard let obs = request.results?.first else { die("no foreground subject found") }

let maskBuffer: CVPixelBuffer
do { maskBuffer = try obs.generateScaledMaskForImage(forInstances: obs.allInstances, from: handler) }
catch { die("mask generation failed: \(error)") }

var mask = CIImage(cvPixelBuffer: maskBuffer)
mask = mask.transformed(by: CGAffineTransform(scaleX: src.extent.width / mask.extent.width,
                                              y: src.extent.height / mask.extent.height))

/* ── 2. de-fringe: erode, then feather back to a soft edge ────────────── */

if erode > 0 {
  let eroded = mask.applyingFilter("CIMorphologyMinimum", parameters: [kCIInputRadiusKey: erode])
  mask = eroded
    .applyingFilter("CIGaussianBlur", parameters: [kCIInputRadiusKey: max(0.6, erode * 0.6)])
    .cropped(to: src.extent)
}

let cut = src
  .applyingFilter("CIBlendWithMask", parameters: [
    kCIInputBackgroundImageKey: CIImage.empty(),
    kCIInputMaskImageKey: mask,
  ])
  .cropped(to: src.extent)

/* ── 3. crop to the alpha bounding box ────────────────────────────────── */

let ctx = CIContext(options: [.workingColorSpace: CGColorSpace(name: CGColorSpace.sRGB)!])
guard let cs = CGColorSpace(name: CGColorSpace.sRGB) else { die("no sRGB colour space") }

let w = Int(cut.extent.width), h = Int(cut.extent.height)
var pixels = [UInt8](repeating: 0, count: w * h * 4)
pixels.withUnsafeMutableBytes { buf in
  ctx.render(cut, toBitmap: buf.baseAddress!, rowBytes: w * 4, bounds: cut.extent,
             format: .RGBA8, colorSpace: cs)
}

// Ignore near-transparent pixels so a stray feathered speck cannot define the box.
let cutoff: UInt8 = 12
var minX = w, minY = h, maxX = -1, maxY = -1
for y in 0..<h {
  let row = y * w * 4
  for x in 0..<w where pixels[row + x * 4 + 3] > cutoff {
    if x < minX { minX = x }; if x > maxX { maxX = x }
    if y < minY { minY = y }; if y > maxY { maxY = y }
  }
}
guard maxX >= minX, maxY >= minY else { die("subject mask is empty") }

// A little breathing room, and never outside the source.
let pad = Int((Double(max(maxX - minX, maxY - minY)) * 0.015).rounded())
minX = max(0, minX - pad); minY = max(0, minY - pad)
maxX = min(w - 1, maxX + pad); maxY = min(h - 1, maxY + pad)

// CoreImage's origin is bottom-left; the scan above is top-down.
let box = CGRect(x: CGFloat(minX), y: CGFloat(h - 1 - maxY),
                 width: CGFloat(maxX - minX + 1), height: CGFloat(maxY - minY + 1))
let cropped = cut.cropped(to: box).transformed(by: CGAffineTransform(translationX: -box.minX, y: -box.minY))

/* ── 4. scale and write ───────────────────────────────────────────────── */

let scale = targetW / cropped.extent.width
let out = cropped
  .applyingFilter("CILanczosScaleTransform", parameters: [kCIInputScaleKey: scale, kCIInputAspectRatioKey: 1.0])
let final = out.cropped(to: CGRect(x: 0, y: 0,
                                   width: (out.extent.width).rounded(.down),
                                   height: (out.extent.height).rounded(.down)))

do { try ctx.writePNGRepresentation(of: final, to: outURL, format: .RGBA8, colorSpace: cs) }
catch { die("write failed: \(error)") }

print("  \(inURL.lastPathComponent) → \(outURL.lastPathComponent)  \(Int(final.extent.width))×\(Int(final.extent.height))")
