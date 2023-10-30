import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Link from "next/link";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import TwitterIcon from "@mui/icons-material/Twitter";

type FooterProps = {};

const ICONS = [
  {
    icon: <LinkedInIcon fontSize="medium" />,
    colorClass: "text-blue-600",
    link: "https://www.linkedin.com/in/amlan-roy/",
  },
  {
    icon: <GitHubIcon fontSize="medium" />,
    colorClass: " text-gray-800",
    link: "https://github.com/amlan-roy/",
  },
  {
    icon: <EmailIcon fontSize="medium" />,
    colorClass: "text-red-400",
    link: "mailto:amlanroy2500@gmail.com",
  },
  {
    icon: <TwitterIcon fontSize="medium" />,
    colorClass: "text-blue-400",
    link: "https://twitter.com/_royamlan_",
  },
];

const Footer: React.FC<FooterProps> = () => {
  return (
    <div className="w-full flex justify-center p-3 flex-wrap z-50">
      <div className="text-lg mr-5">
        Made with <FavoriteIcon color={"error"} /> by{" "}
        <strong> Amlan Roy </strong>
      </div>
      <div className="flex row wrap gap-1">
        {ICONS.map(({ icon, colorClass, link }, index) => (
          <Link
            href={link}
            target="_blank"
            className={`flex items-center cursor-pointer ${colorClass}`}
            key={`footer-contact-icon-${index}`}
          >
            {icon}
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Footer;
