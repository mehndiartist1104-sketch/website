interface LoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({ src, width, quality }: LoaderProps) {
  if (src.includes("res.cloudinary.com") && src.includes("/upload/")) {
    const params = ["f_auto", `q_${quality ?? "auto"}`, `w_${width}`, "c_limit"];
    return src.replace("/upload/", `/upload/${params.join(",")}/`);
  }
  return src;
}
