import type { IconType } from 'react-icons';
import {
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaLink,
  FaTwitter,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';

const ICON_MAP: Record<string, IconType> = {
  fagithub: FaGithub,
  falinkedin: FaLinkedin,
  fatwitter: FaTwitter,
  faxtwitter: FaXTwitter,
  fainstagram: FaInstagram,
  fafacebook: FaFacebook,
  fayoutube: FaYoutube,
  faenvelope: FaEnvelope,
  faglobe: FaGlobe,
};

export function getSocialIcon(iconClass: string) {
  const normalized = iconClass
    .replace(/[^a-zA-Z]/g, '')
    .toLowerCase();

  return ICON_MAP[normalized] ?? FaLink;
}
