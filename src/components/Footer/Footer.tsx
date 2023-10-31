import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Link from "next/link";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import TwitterIcon from "@mui/icons-material/Twitter";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

type FooterProps = {};

const ICONS = [
  {
    icon: <OpenInNewIcon fontSize="medium" />,
    colorClass: "text-gray-800",
    link: "https://amlan-roy.github.io/",
    title: "Visit Amlan's portfolio",
  },
  {
    icon: <LinkedInIcon fontSize="medium" />,
    colorClass: "text-blue-600",
    link: "https://www.linkedin.com/in/amlan-roy/",
    title: "Visit Amlan's LinkedIn profile ",
  },
  {
    icon: <GitHubIcon fontSize="medium" />,
    colorClass: " text-gray-800",
    link: "https://github.com/amlan-roy/",
    title: "Visit Amlan's Github profile",
  },
  {
    icon: <EmailIcon fontSize="medium" />,
    colorClass: "text-red-400",
    link: "mailto:amlanroy2500@gmail.com",
    title: "Email Amlan",
  },
  {
    icon: <TwitterIcon fontSize="medium" />,
    colorClass: "text-blue-400",
    link: "https://twitter.com/_royamlan_",
    title: "Visit Amlan's Twitter profile",
  },
];

const Footer: React.FC<FooterProps> = () => {
  return (
    <div className="w-full flex justify-center p-3 flex-wrap z-50">
      <div className="text-lg mr-5 flex items-center">
        Made with
        <FavoriteIcon color={"error"} className="mx-2" titleAccess="Love" />
        by <strong> Amlan Roy </strong>
      </div>
      <div className="flex row wrap gap-1">
        {ICONS.map(({ icon, colorClass, link, title }, index) => (
          <Link
            href={link}
            target="_blank"
            className={`flex items-center cursor-pointer ${colorClass}`}
            key={`footer-contact-icon-${index}`}
            title={title}
          >
            {icon}
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Footer;
