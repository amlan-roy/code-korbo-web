import Image from "next/image";
import { Typography } from "@mui/material";

export default function ErrorPage({
  title,
  subtitle,
  imageUrl = "/error-png.png",
  isComponent,
}: {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  isComponent?: boolean;
}) {
  return (
    <div
      className={`max-w-[1440px] mx-auto flex w-full grow justify-center items-center flex-col ${
        isComponent ? "mt-8" : "h-full"
      }`}
    >
      <Image
        src={imageUrl}
        alt={"An error occured image"}
        width={256}
        height={256}
      />
      <Typography variant="h4">{title}</Typography>
      <Typography variant="h6">{subtitle}</Typography>
    </div>
  );
}
