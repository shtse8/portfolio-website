import type { IconType } from "react-icons";
import {
  FaAd, FaAndroid, FaApple, FaBell, FaBitcoin, FaBolt,
  FaBoxes, FaBullhorn, FaCamera, FaChartBar, FaChartLine, FaChess,
  FaCloud, FaCloudDownloadAlt, FaCode, FaCodeBranch, FaCogs, FaCreditCard,
  FaCss3, FaCss3Alt, FaCube, FaDatabase, FaDice, FaDocker,
  FaExternalLinkAlt, FaFacebook, FaFileCode, FaFileContract, FaFilePdf, FaFingerprint,
  FaGamepad, FaGithub, FaGlobe, FaHtml5, FaImages, FaJava,
  FaLayerGroup, FaLock, FaMobile, FaMobileAlt, FaMoneyBillWave, FaNetworkWired,
  FaNodeJs, FaPaintBrush, FaPhp, FaPlug, FaProjectDiagram, FaPython,
  FaRadiation, FaReact, FaRegSmile, FaRobot, FaRocket, FaRss,
  FaSearch, FaSearchDollar, FaSearchPlus, FaServer, FaShieldAlt, FaSortAmountUp,
  FaSpider, FaTachometerAlt, FaTelegram, FaTerminal, FaTools, FaTree,
  FaUsers, FaVectorSquare, FaVial, FaVideo, FaVuejs,
  FaRegCircle,
} from "react-icons/fa";
import {
  SiAdobe, SiDart, SiEthereum, SiFirebase, SiFlutter, SiGo,
  SiGooglechrome, SiGooglecloud, SiJavascript, SiKubernetes, SiMysql, SiNestjs,
  SiNextdotjs, SiPytorch, SiSvelte, SiTensorflow, SiTypescript, SiUnity,
  SiSharp,
} from "react-icons/si";

/**
 * The skill dataset stores icons as react-icons string names ("FaReact",
 * "SiTypescript", ...). We map ONLY the names that appear in the data to
 * concrete components — named imports stay tree-shakeable, unlike an
 * `import * as Fa` namespace which would drag the entire icon set into the
 * client bundle. Unknown / renamed names resolve to a neutral fallback so a
 * data change can never crash the render.
 */
const ICONS: Record<string, IconType> = {
  FaAd, FaAndroid, FaApple, FaBell, FaBitcoin, FaBolt,
  FaBoxes, FaBullhorn, FaCamera, FaChartBar, FaChartLine, FaChess,
  FaCloud, FaCloudDownloadAlt, FaCode, FaCodeBranch, FaCogs, FaCreditCard,
  FaCss3, FaCss3Alt, FaCube, FaDatabase, FaDice, FaDocker,
  FaExternalLinkAlt, FaFacebook, FaFileCode, FaFileContract, FaFilePdf, FaFingerprint,
  FaGamepad, FaGithub, FaGlobe, FaHtml5, FaImages, FaJava,
  FaLayerGroup, FaLock, FaMobile, FaMobileAlt, FaMoneyBillWave, FaNetworkWired,
  FaNodeJs, FaPaintBrush, FaPhp, FaPlug, FaProjectDiagram, FaPython,
  FaRadiation, FaReact, FaRegSmile, FaRobot, FaRocket, FaRss,
  FaSearch, FaSearchDollar, FaSearchPlus, FaServer, FaShieldAlt, FaSortAmountUp,
  FaSpider, FaTachometerAlt, FaTelegram, FaTerminal, FaTools, FaTree,
  FaUsers, FaVectorSquare, FaVial, FaVideo, FaVuejs, SiAdobe,
  SiDart, SiEthereum, SiFirebase, SiFlutter, SiGo, SiGooglechrome,
  SiGooglecloud, SiJavascript, SiKubernetes, SiMysql, SiNestjs, SiNextdotjs,
  SiPytorch, SiSvelte, SiTensorflow, SiTypescript, SiUnity,
  // C#'s "SiCsharp" was renamed upstream; alias it to the current glyph.
  SiCsharp: SiSharp,
};

export function resolveIcon(name?: string): IconType {
  return (name && ICONS[name]) || FaRegCircle;
}

export default function SkillIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = resolveIcon(name);
  return <Icon className={className} aria-hidden focusable={false} />;
}
