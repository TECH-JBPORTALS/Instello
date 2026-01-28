
import sharp from "sharp";
import { encode } from "blurhash";

export async function generateBlurHash(imagePath: string) {
    const res = await fetch(imagePath);
    const buffer = Buffer.from(await res.arrayBuffer());
    // 2. Resize + convert to raw pixels
    const image = sharp(buffer).resize(32, 32, { fit: "inside" });

    const { data, info } = await image
        .raw()
        .ensureAlpha()
        .toBuffer({ resolveWithObject: true });

    // 3. Encode BlurHash
    return encode(
        new Uint8ClampedArray(data),
        info.width,
        info.height,
        4,
        4
    );
}