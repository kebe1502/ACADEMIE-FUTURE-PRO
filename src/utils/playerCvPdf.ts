import { jsPDF } from 'jspdf';
import { Player, PlayerCV, ClubInfo } from '../types';
import { getPlayerFullName } from './playerHelpers';

/**
 * Chargeur d'images sécurisé pour Canvas avec gestion du crossOrigin et du proxy.
 * Ne rejette JAMAIS d'erreur pour éviter tout plantage : renvoie null si l'image est indisponible.
 */
export const loadCanvasImage = (src: string): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Si échec sur une URL externe, tenter via le proxy local
      if (src.startsWith('http')) {
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(src)}`;
        const pImg = new Image();
        pImg.crossOrigin = 'anonymous';
        pImg.onload = () => resolve(pImg);
        pImg.onerror = () => resolve(null);
        pImg.src = proxyUrl;
      } else {
        resolve(null);
      }
    };
    img.src = src;
  });
};

/**
 * Découpe et dessine du texte sur plusieurs lignes sur un Canvas 2D
 */
function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 6
): number {
  if (!text) return y;
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let linesCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      linesCount++;
      if (linesCount >= maxLines) break;
    } else {
      line = testLine;
    }
  }
  if (linesCount < maxLines && line.trim().length > 0) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

/**
 * Dessine un rectangle à coins arrondis compatible avec tous les contextes canvas
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Génère le CV Sportif officiel au format exact de a298d75b69d5a848159d0643060a981f.jpg
 * via un rendu Canvas 2D ultra haute définition direct (1200 x 1697 px, format A4 exact).
 * 
 * Cette méthode ne dépend pas de html2canvas :
 * - Aucune altération du DOM (l'écran ne devient jamais noir).
 * - Aucun bug de parser CSS (oklch, backdrop-blur, etc.).
 * - Aucun problème de sécurité canvas (CORS).
 * - Intègre obligatoirement la photo du joueur, le logo du club et la pelouse avec ballon.
 */
export const exportPlayerCvToPdfDirect = async (
  player: Player,
  cv: PlayerCV,
  clubInfo: ClubInfo
): Promise<void> => {
  // Dimensions exactes du format A4 au ratio 1 : 1.4142857 (Haute Résolution)
  const width = 1200;
  const height = 1697;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Impossible de créer le contexte Canvas 2D');

  // 1. Préchargement en parallèle des images (photo joueur, logo club, pelouse)
  const [playerImg, logoImg, grassImg] = await Promise.all([
    loadCanvasImage(player.photoUrl || '/pape-modou-cisse.jpg'),
    loadCanvasImage(clubInfo?.logoUrl || '/icon.svg'),
    loadCanvasImage('/soccer-ball-grass.jpg'),
  ]);

  // 2. Fond Sombre général (#141518)
  ctx.fillStyle = '#141518';
  ctx.fillRect(0, 0, width, height);

  // Lignes ondulées décoratives en filigrane (en haut à gauche)
  ctx.save();
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(-50, 45 + i * 28);
    ctx.bezierCurveTo(120, 95 + i * 36, 260, 15 + i * 36, 480, 155 + i * 36);
    ctx.stroke();
  }
  ctx.restore();

  // 3. En-tête supérieur gauche : Logo Club & Titre
  const startX = 65;
  if (logoImg) {
    ctx.drawImage(logoImg, startX, 48, 55, 62);
  }
  const titleX = logoImg ? startX + 68 : startX;

  ctx.fillStyle = '#EAB308';
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.fillText(`${(clubInfo?.name || 'ASC DIALLORÉ').toUpperCase()} • TOUBA MBACKÉ`, titleX, 74);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '12px -apple-system, sans-serif';
  ctx.fillText(`DOSSIER DE DÉTECTION & CV SPORTIF OFFICIEL • SÉNÉGAL`, titleX, 95);

  // 4. Grand Nom Doré du Joueur (style GAETAN Ferland)
  const firstName = (player.firstName || player.name.split(' ')[0] || '').toUpperCase();
  const lastName = player.lastName || player.name.split(' ').slice(1).join(' ') || '';

  ctx.fillStyle = '#F5C242';
  ctx.font = '900 48px Georgia, serif';
  ctx.fillText(`${firstName} ${lastName}`, startX, 175);

  // 5. Ruban Jaune Doré "FOOTBALLEUR" avec biseau - s'adapte à la largeur du texte (width: fit-content, white-space: nowrap)
  ctx.save();
  ctx.fillStyle = '#F5C242';
  ctx.font = '900 15px -apple-system, BlinkMacSystemFont, sans-serif';
  const posLabel = player.positionDetail ? ` • ${player.positionDetail.toUpperCase()}` : '';
  const ribbonText = `F O O T B A L L E U R${posLabel}`;
  const ribbonWidth = Math.round(ctx.measureText(ribbonText).width + 42);
  const rx = startX, ry = 196, rw = ribbonWidth, rh = 38;
  ctx.beginPath();
  ctx.moveTo(rx, ry);
  ctx.lineTo(rx + rw, ry);
  ctx.lineTo(rx + rw - 14, ry + rh);
  ctx.lineTo(rx, ry + rh);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#000000';
  ctx.fillText(ribbonText, rx + 18, ry + 25);
  ctx.restore();

  // 6. Cadre Ovale Organique de la Photo Officielle (Haut Droit)
  const cx = 1010;
  const cy = 175;
  const radX = 125;
  const radY = 150;

  // Liseré vert-lime / or d'arrière-plan
  ctx.save();
  ctx.fillStyle = '#84CC16';
  ctx.beginPath();
  ctx.ellipse(cx + 6, cy + 4, radX + 4, radY + 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Découpe et affichage de la photo
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, radX, radY, 0, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(cx - radX, cy - radY, radX * 2, radY * 2);

  if (playerImg) {
    ctx.drawImage(playerImg, cx - radX, cy - radY, radX * 2, radY * 2);
  } else {
    // Fallback silhouette / texte si image non chargée
    ctx.fillStyle = '#334155';
    ctx.fillRect(cx - radX, cy - radY, radX * 2, radY * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(firstName[0] + (lastName[0] || ''), cx, cy + 12);
    ctx.textAlign = 'start';
  }
  ctx.restore();

  // Bordure verte du cadre ovale
  ctx.save();
  ctx.strokeStyle = '#84CC16';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(cx, cy, radX, radY, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Badge Maillot # en bas à gauche de la photo
  ctx.fillStyle = '#EAB308';
  drawRoundedRect(ctx, cx - radX + 10, cy + radY - 26, 62, 32, 8);
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.font = '900 16px -apple-system, sans-serif';
  ctx.fillText(`#${player.number}`, cx - radX + 22, cy + radY - 4);

  // =========================================================================
  // 7. SECTION CENTRALE : 2 COLONNES (À PROPOS / FORMATIONS / EXPÉRIENCE)
  // =========================================================================
  const col1X = 65;
  const col2X = 525;
  const col1Width = 420;
  const col2Width = 610;

  // --- COLONNE GAUCHE ---
  // A. Section "À propos"
  let leftY = 295;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px Georgia, serif';
  ctx.fillText('⚽  À propos', col1X, leftY);
  leftY += 26;

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '13px -apple-system, sans-serif';
  const bioSummary = cv.summary || player.bio ||
    `Joueur athlétique, rapide et discipliné au sein de l'ASC Dialloré. Doté d'une excellente vision de jeu et d'une rigueur tactique exemplaire, il se distingue par son efficacité dans les duels et sa contribution offensive décisive.`;
  leftY = wrapCanvasText(ctx, bioSummary, col1X, leftY, col1Width, 21, 5) + 16;

  // B. Encadré de Coordonnées (Avec barre dorée verticale à gauche)
  const contactBoxY = leftY;
  ctx.fillStyle = '#F5C242';
  ctx.fillRect(col1X, contactBoxY, 5, 140);

  const contactTextX = col1X + 22;
  const contactLines = [
    { icon: '📞', text: cv.contactReferent?.officialPhone || '+221 77 123 45 67' },
    { icon: '@', text: cv.contactReferent?.officialEmail || 'contact@ascdiallore.sn' },
    { icon: '📍', text: 'Touba Mbacké, Sénégal' },
    { icon: '⚽', text: `Licence ONGAM #${cv.contactReferent?.licenceNumber || 'DK-MBK-2025'}` },
  ];

  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillStyle = '#F8FAFC';
  contactLines.forEach((item, idx) => {
    const lineY = contactBoxY + 24 + idx * 34;
    ctx.fillText(`${item.icon}   ${item.text}`, contactTextX, lineY);
  });
  leftY = contactBoxY + 165;

  // C. Section "COMPÉTENCES"
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px Georgia, serif';
  ctx.fillText('⚽  COMPÉTENCES', col1X, leftY);
  leftY += 26;

  const skillsList = cv.strengths && cv.strengths.length > 0
    ? cv.strengths.slice(0, 8)
    : [
        'Rigueur & Discipline tactique',
        'Dynamisme & Vitesse d’exécution',
        'Engagement physique & Combativité',
        'Sens du collectif & Vision de jeu',
        'Finition & Précision face au but',
        'Endurance & VMA élevée',
        'Polyvalence de poste & Placement',
      ];

  ctx.font = '13px -apple-system, sans-serif';
  ctx.fillStyle = '#CBD5E1';
  skillsList.forEach((sk) => {
    ctx.fillStyle = '#F5C242';
    ctx.fillText('-', col1X + 4, leftY);
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText(sk, col1X + 20, leftY);
    leftY += 24;
  });

  // --- COLONNE DROITE ---
  // A. Section "FORMATIONS"
  let rightY = 295;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px Georgia, serif';
  ctx.fillText('⚽  FORMATIONS', col2X, rightY);
  rightY += 30;

  const formationsList = [
    {
      title: 'ACADÉMIE ASC DIALLORÉ',
      period: '2022 - 2024',
      desc: 'Formation élite avancée, perfectionnement tactique, préparation athlétique et transitions de jeu.',
    },
    {
      title: 'CENTRE DE FORMATION JEUNES MBACKÉ',
      period: '2020 - 2022',
      desc: 'Apprentissage des fondamentaux du football moderne, motricité, coordination et maîtrise technique.',
    },
  ];

  formationsList.forEach((f) => {
    // Puce dorée double cercle
    ctx.fillStyle = '#F5C242';
    ctx.beginPath();
    ctx.arc(col2X + 8, rightY - 5, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#141518';
    ctx.beginPath();
    ctx.arc(col2X + 8, rightY - 5, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px -apple-system, sans-serif';
    ctx.fillText(`${f.title}  (${f.period})`, col2X + 26, rightY);
    rightY += 20;

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '12.5px -apple-system, sans-serif';
    rightY = wrapCanvasText(ctx, f.desc, col2X + 26, rightY, col2Width - 30, 18, 2) + 16;
  });

  // B. Section "EXPÉRIENCE PROFESSIONNELLE"
  rightY += 8;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px Georgia, serif';
  ctx.fillText('⚽  EXPÉRIENCE PROFESSIONNELLE', col2X, rightY);
  rightY += 32;

  const timelineStartY = rightY - 10;

  const defaultPeriods = ['2024 - 2026', '2022 - 2024', '2020 - 2022'];

  const rawExperiences = cv.careerHistory && cv.careerHistory.length > 0
    ? cv.careerHistory.slice(0, 3)
    : [
        {
          period: '2024 - 2026',
          category: 'Senior Élite Navétanes',
          clubOrSchool: clubInfo?.name || 'ASC Dialloré',
          roleAndAchievements: `Joueur titulaire (${player.appearances || 28} matchs, ${player.goals || 28} buts). Championnat officiel ONGAM Touba-Mbacké.`,
        },
        {
          period: '2022 - 2024',
          category: 'Titulaire Régional',
          clubOrSchool: 'Sélection Zonale de Mbacké',
          roleAndAchievements: 'Participation aux tournois majeurs régionaux et distinction de meilleur espoir offensif.',
        },
        {
          period: '2020 - 2022',
          category: 'Catégorie Espoirs',
          clubOrSchool: 'Académie Future Pro',
          roleAndAchievements: 'Intégration au groupe premier, progression sous la supervision directe du staff technique.',
        },
      ];

  const experiencesList = rawExperiences.map((exp, i) => {
    let p = (exp.period || defaultPeriods[i] || '2024 - 2026').replace(/[–—/]/g, '-').trim();
    p = p.replace(/(^|\s|-)([12]\d)($|\s|-)/g, (m, pre, yr, post) => `${pre}20${yr}${post}`);
    p = p.replace(/\s*-\s*/g, ' - ');
    return {
      ...exp,
      period: p,
    };
  });

  experiencesList.forEach((exp) => {
    // Puce dorée sur la timeline
    ctx.fillStyle = '#F5C242';
    ctx.beginPath();
    ctx.arc(col2X + 8, rightY - 5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#141518';
    ctx.beginPath();
    ctx.arc(col2X + 8, rightY - 5, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#F5C242';
    ctx.font = 'bold 14px -apple-system, sans-serif';
    ctx.fillText(`${exp.period} : Footballeur (${exp.category})`, col2X + 26, rightY);
    rightY += 20;

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '12.5px -apple-system, sans-serif';
    const expText = exp.roleAndAchievements || `Titulaire au sein de ${exp.clubOrSchool}. Participation active aux compétitions officielles.`;
    rightY = wrapCanvasText(ctx, expText, col2X + 26, rightY, col2Width - 30, 18, 3) + 18;
  });

  // Ligne de timeline verticale continue
  ctx.save();
  ctx.strokeStyle = 'rgba(245, 194, 66, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(col2X + 8, timelineStartY);
  ctx.lineTo(col2X + 8, rightY - 20);
  ctx.stroke();
  ctx.restore();

  // =========================================================================
  // 8. SECTION INFÉRIEURE : PELOUSE VERTE, BALLON DE FOOT & ENCADRÉS
  // =========================================================================
  // On remonte le bloc du bas juste sous le contenu pour supprimer tout grand espace vide
  const contentBottomY = Math.max(leftY, rightY);
  const grassStartY = Math.max(contentBottomY + 25, 960);
  const grassHeight = height - grassStartY;

  // Pelouse de stade : si l'image est chargée, on la dessine, sinon gradient vert intense
  if (grassImg) {
    ctx.drawImage(grassImg, 0, grassStartY, width, grassHeight);
  } else {
    const grassGrad = ctx.createLinearGradient(0, grassStartY, 0, height);
    grassGrad.addColorStop(0, '#1c4a2a');
    grassGrad.addColorStop(0.5, '#14381e');
    grassGrad.addColorStop(1, '#0e2414');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, grassStartY, width, grassHeight);
  }

  // Voile sombre semi-transparent pour détacher les textes
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(0, grassStartY, width, grassHeight);

  // Liseré supérieur vert-lime
  ctx.fillStyle = '#84CC16';
  ctx.fillRect(0, grassStartY, width, 4);

  // Boîte Translucide Gauche : COMPÉTENCES TECHNIQUES
  const boxW = 425;
  const boxH = Math.min(370, grassHeight - 65);
  const boxY = grassStartY + 35;

  ctx.fillStyle = 'rgba(12, 13, 16, 0.90)';
  drawRoundedRect(ctx, 65, boxY, boxW, boxH, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#F5C242';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.fillText('COMPÉTENCES TECHNIQUES', 90, boxY + 36);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.moveTo(90, boxY + 48);
  ctx.lineTo(65 + boxW - 25, boxY + 48);
  ctx.stroke();

  const techItems = [
    '✔  Contrôle orienté & Dribble en vitesse',
    '✔  Puissance & Précision de frappe',
    `✔  Vitesse max : ${cv.physicalMetrics?.speedKmH || '33.8 km/h'}`,
    `✔  Endurance VMA : ${cv.physicalMetrics?.staminaVma || '19.5 km/h'}`,
    `✔  Évaluation Staff Scout : ${cv.coachEvaluation?.ratingOutOf100 || 88} / 100`,
    `✔  Détente sèche : ${cv.physicalMetrics?.verticalJumpCm || '68 cm'}`,
  ];

  ctx.fillStyle = '#F1F5F9';
  ctx.font = '13px -apple-system, sans-serif';
  techItems.forEach((item, i) => {
    ctx.fillText(item, 90, boxY + 82 + i * 38);
  });

  // Ballon de Football Central 3D
  const ballCx = 600;
  const ballCy = boxY + boxH / 2;
  const ballR = 60;

  ctx.save();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(ballCx, ballCy, ballR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.font = '68px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚽', ballCx, ballCy);
  ctx.restore();

  // Boîte Translucide Droite : LANGUES & PROFIL (renommé, sans licence en double)
  const box2X = 710;
  ctx.fillStyle = 'rgba(12, 13, 16, 0.90)';
  drawRoundedRect(ctx, box2X, boxY, boxW, boxH, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#F5C242';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.fillText('LANGUES & PROFIL', box2X + 25, boxY + 36);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.moveTo(box2X + 25, boxY + 48);
  ctx.lineTo(box2X + boxW - 25, boxY + 48);
  ctx.stroke();

  const langItems = [
    '■  Wolof - Langue maternelle',
    '■  Français - Courant',
    '■  Anglais - Technique / Sportif',
    `■  Pied fort : ${cv.dominantFoot || player.preferredFoot || 'Droit'}`,
    `■  Taille & Poids : ${player.height} • ${player.weight}`,
    `■  Nationalité : ${player.nationality || 'Sénégalaise'} (${player.age || 21} ans)`,
  ];

  ctx.fillStyle = '#F1F5F9';
  ctx.font = '13px -apple-system, sans-serif';
  langItems.forEach((item, i) => {
    ctx.fillText(item, box2X + 25, boxY + 82 + i * 38);
  });

  // 9. Exportation directe vers fichier PDF A4
  const imgData = canvas.toDataURL('image/jpeg', 0.96);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

  const sanitizedName = player.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '_');

  pdf.save(`CV_Officiel_${sanitizedName}_ASC_DIALLORE.pdf`);
};

/**
 * Génère le résumé texte complet du CV Sportif pour partage direct (WhatsApp, etc.)
 */
export const generatePlayerCvShareText = (
  player: Player,
  cv: PlayerCV,
  clubInfo: ClubInfo
): string => {
  const playerFullName = getPlayerFullName(player);
  return `📋 *CV SPORTIF OFFICIEL • ${playerFullName.toUpperCase()} (#${player.number})*
⚽ *Poste :* ${player.positionDetail || player.position}
🇸🇳 *Club :* ${clubInfo?.name || 'ASC Dialloré'} (Touba Mbacké)
🦶 *Pied fort :* ${cv.dominantFoot} | *Taille/Poids :* ${player.height} / ${player.weight}
⚡ *Vitesse :* ${cv.physicalMetrics.speedKmH} | *VMA :* ${cv.physicalMetrics.staminaVma}
⭐ *Note Staff :* ${cv.coachEvaluation.ratingOutOf100}/100

*À propos :*
« ${cv.summary} »

*Compétences clés :*
${cv.strengths.map((s) => `• ${s}`).join('\n')}

*Avis Coach Gagne :*
${cv.coachEvaluation.technicalComments}

📞 *Contact Recrutement :* ${cv.contactReferent.officialPhone} (${cv.contactReferent.officialEmail})`;
};
