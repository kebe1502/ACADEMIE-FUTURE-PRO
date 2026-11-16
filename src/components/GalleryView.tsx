import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit,
  Search,
  Filter,
  Eye,
  Calendar,
  Camera,
  Share2,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock,
  Upload,
  Sparkles,
  CheckSquare,
  Square,
  AlertTriangle,
  Layers,
  Play,
  Film,
  Video,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GalleryPhoto } from '../types';
import { getAccentStyles } from '../utils/theme';
import { AdminQuickLoginModal } from './AdminQuickLoginModal';

export const GalleryView: React.FC = () => {
  const {
    gallery,
    addGalleryPhoto,
    updateGalleryPhoto,
    addMultipleGalleryPhotos,
    deleteGalleryPhoto,
    deleteMultipleGalleryPhotos,
    isAdminLoggedIn,
    setActiveTab,
    themeAccent,
    triggerShare,
    showToast,
    clubInfo,
  } = useApp();

  const accent = getAccentStyles(themeAccent);

  // Filters state
  const [selectedMediaTypeFilter, setSelectedMediaTypeFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMedia, setActiveMedia] = useState<GalleryPhoto | null>(null);

  // Multi-selection state for batch deletion
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Admin Quick Login Modal State
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Admin Add / Edit Media Modal State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryPhoto | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [addMode, setAddMode] = useState<'single' | 'batch'>('single');

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryPhoto['category']>('joueurs');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('01:30');
  const [date, setDate] = useState(new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }));
  const [description, setDescription] = useState('');
  const [photographer, setPhotographer] = useState('Cellule Média ASCD');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Batch Photos / Videos State
  const [batchCategory, setBatchCategory] = useState<GalleryPhoto['category']>('joueurs');
  const [batchDate, setBatchDate] = useState('Saison 2026');
  const [batchPhotographer, setBatchPhotographer] = useState('Cellule Média ASCD');
  const [batchUrlsText, setBatchUrlsText] = useState('');
  const [batchUploadedFiles, setBatchUploadedFiles] = useState<{ title: string; url: string; type: 'photo' | 'video' }[]>([]);

  // Presets for Photos
  const presetPhotos = [
    {
      label: 'Équipe au complet (Stade)',
      url: '/diallore-team-banner.jpg',
      category: 'equipe' as const,
    },
    {
      label: 'Célébration Victoire 3-0',
      url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      category: 'matchs' as const,
    },
    {
      label: 'Séance Tactique Staff',
      url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
      category: 'staff' as const,
    },
    {
      label: 'Joueur en Action (Frappe)',
      url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      category: 'joueurs' as const,
    },
    {
      label: 'Ferveur des Supporters',
      url: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1200&q=80',
      category: 'evenements' as const,
    },
    {
      label: 'Échauffement Nocturne',
      url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
      category: 'matchs' as const,
    },
  ];

  // Presets for Videos
  const presetVideos = [
    {
      label: 'Dribbles & Gestes de Pape Modou Cissé',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-doing-tricks-with-a-ball-40409-large.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      duration: '01:30',
      category: 'joueurs' as const,
    },
    {
      label: 'Célébration des Cadets dans le Vestiaire',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-training-with-a-soccer-ball-42867-large.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      duration: '00:45',
      category: 'matchs' as const,
    },
    {
      label: 'Causerie du Coach Gagne & Présidence',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-coach-talking-to-a-soccer-team-43577-large.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
      duration: '02:15',
      category: 'staff' as const,
    },
    {
      label: 'Frappe spectaculaire et célébration au Stade',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-ball-in-stadium-41136-large.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
      duration: '01:10',
      category: 'matchs' as const,
    },
  ];

  // Helper for YouTube embed
  const isYouTubeUrl = (url?: string) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : url;
  };

  const totalPhotosCount = gallery.filter(i => (i.mediaType || 'photo') === 'photo').length;
  const totalVideosCount = gallery.filter(i => i.mediaType === 'video').length;

  const categories = [
    { id: 'all', label: 'Toutes les catégories', count: gallery.length },
    { id: 'joueurs', label: 'Joueurs', count: gallery.filter(p => p.category === 'joueurs').length },
    { id: 'staff', label: 'Staff & Présidence', count: gallery.filter(p => p.category === 'staff').length },
    { id: 'equipe', label: 'Équipes & Groupes', count: gallery.filter(p => p.category === 'equipe').length },
    { id: 'matchs', label: 'Matchs & Victoires', count: gallery.filter(p => p.category === 'matchs').length },
    { id: 'evenements', label: 'Événements & Supporters', count: gallery.filter(p => p.category === 'evenements').length },
  ];

  const filteredMedia = gallery.filter(item => {
    const itemType = item.mediaType || 'photo';
    if (selectedMediaTypeFilter !== 'all' && itemType !== selectedMediaTypeFilter) {
      return false;
    }
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.photographer && item.photographer.toLowerCase().includes(query)) ||
      item.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const resetMediaForm = () => {
    setEditingItem(null);
    setMediaType('photo');
    setAddMode('single');
    setTitle('');
    setCategory('joueurs');
    setImageUrl('');
    setVideoUrl('');
    setDuration('01:30');
    setDate(new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }));
    setDescription('');
    setPhotographer('Cellule Média ASCD');
    setBatchUploadedFiles([]);
    setBatchUrlsText('');
  };

  const handleOpenAddModal = (type: 'photo' | 'video' = 'photo', mode: 'single' | 'batch' = 'single') => {
    resetMediaForm();
    setMediaType(type);
    setAddMode(mode);
    setIsMediaModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryPhoto, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveMedia(null);
    setEditingItem(item);
    setMediaType(item.mediaType || 'photo');
    setAddMode('single');
    setTitle(item.title);
    setCategory(item.category);
    setImageUrl(item.imageUrl);
    setVideoUrl(item.videoUrl || '');
    setDuration(item.duration || '01:30');
    setDate(item.date || new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }));
    setDescription(item.description || '');
    setPhotographer(item.photographer || 'Cellule Média ASCD');
    setIsMediaModalOpen(true);
  };

  // Image Upload handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Fichier trop volumineux', 'Veuillez choisir une image inférieure à 10 Mo.', 'alert');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setImageUrl(ev.target.result as string);
          showToast('Image chargée', 'La photo a été chargée avec succès.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Video Upload handler
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        showToast('Fichier volumineux', 'Veuillez choisir un fichier vidéo inférieur à 50 Mo.', 'alert');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setVideoUrl(ev.target.result as string);
          // If no thumbnail set yet, use a football action cover
          if (!imageUrl) {
            setImageUrl('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80');
          }
          showToast('Vidéo chargée', 'Le fichier vidéo est prêt pour publication.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Multi-files upload for batch mode
  const handleMultipleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const loadedFiles: { title: string; url: string; type: 'photo' | 'video' }[] = [];
    let processed = 0;

    Array.from(files).forEach((file: File) => {
      const isVid = file.type.startsWith('video');
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          loadedFiles.push({
            title: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
            url: ev.target.result as string,
            type: isVid ? 'video' : 'photo',
          });
        }
        processed++;
        if (processed === files.length) {
          setBatchUploadedFiles(prev => [...prev, ...loadedFiles]);
          showToast('Fichiers chargés', `${loadedFiles.length} médias prêts à être publiés.`, 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();

    // Mode Batch : Ajout de plusieurs photos/vidéos
    if (addMode === 'batch') {
      const itemsToPublish: GalleryPhoto[] = [];

      // 1. Files uploaded
      batchUploadedFiles.forEach((f, idx) => {
        const isVid = f.type === 'video';
        itemsToPublish.push({
          id: `gal-batch-file-${Date.now()}-${idx}`,
          title: f.title || `${isVid ? 'Vidéo' : 'Cliché'} officiel #${gallery.length + idx + 1}`,
          category: batchCategory,
          mediaType: f.type,
          imageUrl: isVid
            ? 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80'
            : f.url,
          videoUrl: isVid ? f.url : undefined,
          duration: isVid ? '01:30' : undefined,
          date: batchDate.trim() || '2026',
          photographer: batchPhotographer.trim() || undefined,
        });
      });

      // 2. URLs pasted in textarea
      if (batchUrlsText.trim()) {
        const lines = batchUrlsText
          .split('\n')
          .map(l => l.trim())
          .filter(l => l.startsWith('http') || l.startsWith('/'));

        lines.forEach((url, idx) => {
          const isVid = url.endsWith('.mp4') || url.endsWith('.webm') || isYouTubeUrl(url);
          itemsToPublish.push({
            id: `gal-batch-url-${Date.now()}-${idx}`,
            title: `Média officiel #${gallery.length + itemsToPublish.length + 1}`,
            category: batchCategory,
            mediaType: isVid ? 'video' : 'photo',
            imageUrl: isVid
              ? 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80'
              : url,
            videoUrl: isVid ? url : undefined,
            duration: isVid ? '01:30' : undefined,
            date: batchDate.trim() || '2026',
            photographer: batchPhotographer.trim() || undefined,
          });
        });
      }

      if (itemsToPublish.length === 0) {
        showToast('Aucun fichier', 'Veuillez téléverser des fichiers ou saisir des URLs.', 'alert');
        return;
      }

      addMultipleGalleryPhotos(itemsToPublish);
      setIsMediaModalOpen(false);
      resetMediaForm();
      return;
    }

    // Mode Single : Create or Edit
    if (!title.trim()) {
      showToast('Titre requis', 'Veuillez renseigner un titre.', 'alert');
      return;
    }

    if (mediaType === 'video' && !videoUrl.trim() && !imageUrl.trim()) {
      showToast('Vidéo requise', 'Veuillez renseigner l’URL de la vidéo ou téléverser un fichier.', 'alert');
      return;
    }

    if (mediaType === 'photo' && !imageUrl.trim()) {
      showToast('Photo requise', 'Veuillez renseigner l’URL de l’image ou téléverser une photo.', 'alert');
      return;
    }

    // Default image for video thumbnail if not provided
    const effectiveImageUrl =
      imageUrl.trim() ||
      (mediaType === 'video'
        ? 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80'
        : '');

    if (editingItem) {
      // Modification existante (Photo ou Vidéo)
      const updatedFields: Partial<GalleryPhoto> = {
        title: title.trim(),
        category,
        mediaType,
        imageUrl: effectiveImageUrl,
        videoUrl: mediaType === 'video' ? videoUrl.trim() || undefined : undefined,
        duration: mediaType === 'video' ? duration.trim() || undefined : undefined,
        date: date.trim() || '2026',
        description: description.trim() || undefined,
        photographer: photographer.trim() || undefined,
      };

      updateGalleryPhoto(editingItem.id, updatedFields);

      if (activeMedia && activeMedia.id === editingItem.id) {
        setActiveMedia({
          ...activeMedia,
          ...updatedFields,
        });
      }

      setIsMediaModalOpen(false);
      resetMediaForm();
    } else {
      // Ajout nouveau (Photo ou Vidéo)
      const newMedia: GalleryPhoto = {
        id: `gal-${Date.now()}`,
        title: title.trim(),
        category,
        mediaType,
        imageUrl: effectiveImageUrl,
        videoUrl: mediaType === 'video' ? videoUrl.trim() : undefined,
        duration: mediaType === 'video' ? duration.trim() || '01:30' : undefined,
        date: date.trim() || '2026',
        description: description.trim() || undefined,
        photographer: photographer.trim() || undefined,
      };

      addGalleryPhoto(newMedia);
      setIsMediaModalOpen(false);
      resetMediaForm();
    }
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    deleteGalleryPhoto(id);
    setSelectedMediaIds(prev => prev.filter(item => item !== id));
    if (activeMedia?.id === id) {
      setActiveMedia(null);
    }
    setDeleteConfirmId(null);
  };

  // Toggle selection for bulk delete
  const toggleSelectMedia = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedMediaIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedMediaIds.length === filteredMedia.length && filteredMedia.length > 0) {
      setSelectedMediaIds([]);
    } else {
      setSelectedMediaIds(filteredMedia.map(m => m.id));
    }
  };

  const handleConfirmBulkDelete = () => {
    if (selectedMediaIds.length === 0) return;
    deleteMultipleGalleryPhotos(selectedMediaIds);
    if (activeMedia && selectedMediaIds.includes(activeMedia.id)) {
      setActiveMedia(null);
    }
    setSelectedMediaIds([]);
    setIsBulkDeleteModalOpen(false);
  };

  const getCategoryBadgeColor = (cat: GalleryPhoto['category']) => {
    switch (cat) {
      case 'joueurs':
        return 'bg-amber-500 text-slate-950';
      case 'staff':
        return 'bg-emerald-600 text-white';
      case 'equipe':
        return 'bg-red-600 text-white';
      case 'matchs':
        return 'bg-blue-600 text-white';
      case 'evenements':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  const getCategoryLabel = (cat: GalleryPhoto['category']) => {
    switch (cat) {
      case 'joueurs':
        return 'Joueurs';
      case 'staff':
        return 'Staff & Direction';
      case 'equipe':
        return 'Équipe';
      case 'matchs':
        return 'Matchs';
      case 'evenements':
        return 'Événements';
      default:
        return cat;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-black uppercase tracking-wider">
            <Film className="w-3.5 h-3.5" />
            <span>Médiathèque Officielle ASC Dialloré</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white uppercase">
            Galerie Photos & <span className="text-red-500">Vidéos</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Revivez les temps forts, les séances d'entraînement des Cadets, les célébrations de victoires et les coulisses du staff de l'ASC Dialloré à Touba-Mbacké en photos et vidéos.
          </p>

          {/* Action Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {isAdminLoggedIn ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOpenAddModal('photo', 'single')}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Ajouter une photo</span>
                </button>

                <button
                  onClick={() => handleOpenAddModal('video', 'single')}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center gap-2 transition"
                >
                  <Video className="w-4 h-4 stroke-[3]" />
                  <span>+ Ajouter une vidéo</span>
                </button>

                <button
                  onClick={() => handleOpenAddModal('photo', 'batch')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 border border-slate-700 transition"
                  title="Ajouter plusieurs fichiers en même temps"
                >
                  <Layers className="w-4 h-4 text-red-400" />
                  <span>Ajout multiple</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Connexion Administrateur</span>
              </button>
            )}

            <button
              onClick={() =>
                triggerShare({
                  title: `Galerie Photos & Vidéos - ${clubInfo.name}`,
                  text: `Découvrez la médiathèque officielle de l'${clubInfo.name} : photos, vidéos des matchs, staff et ambiance à Touba-Mbacké !`,
                  url: window.location.href,
                })
              }
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 border border-white/10 transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Partager la galerie</span>
            </button>
          </div>
        </div>
      </div>

      {/* Media Type Tabs Filter (Tous / Photos / Vidéos) */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedMediaTypeFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 ${
              selectedMediaTypeFilter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tous les médias ({gallery.length})</span>
          </button>

          <button
            onClick={() => setSelectedMediaTypeFilter('photo')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 ${
              selectedMediaTypeFilter === 'photo'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-red-500" />
            <span>Photos ({totalPhotosCount})</span>
          </button>

          <button
            onClick={() => setSelectedMediaTypeFilter('video')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 ${
              selectedMediaTypeFilter === 'video'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Film className="w-4 h-4 text-amber-500" />
            <span>Vidéos ({totalVideosCount})</span>
          </button>
        </div>

        {isAdminLoggedIn && (
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 px-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Admin : modifier ou supprimer n'importe quelle photo ou vidéo</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? `${accent.bg} shadow-md`
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-white/30 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input & Select All Checkbox */}
        <div className="flex items-center gap-2">
          {isAdminLoggedIn && (
            <button
              onClick={handleSelectAll}
              className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition whitespace-nowrap"
            >
              {selectedMediaIds.length === filteredMedia.length && filteredMedia.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-red-500" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>
                {selectedMediaIds.length === filteredMedia.length && filteredMedia.length > 0
                  ? 'Tout désélectionner'
                  : 'Sélection multiple'}
              </span>
            </button>
          )}

          <div className="relative min-w-[200px] sm:min-w-[260px] flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre, joueur, date..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Admin Notice Bar */}
      {isAdminLoggedIn ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>
              <strong>Administration Galerie Active :</strong> Vous pouvez <strong>ajouter</strong> ou <strong>supprimer des vidéos et photos</strong>, ou <strong>modifier</strong> chaque photo ou vidéo (bouton bleu « Modifier »).
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => handleOpenAddModal('photo', 'single')}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+1 Photo</span>
            </button>
            <button
              onClick={() => handleOpenAddModal('video', 'single')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow transition"
            >
              <Video className="w-3.5 h-3.5" />
              <span>+1 Vidéo</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            Seul l'administrateur peut ajouter, modifier ou supprimer les photos et vidéos de la galerie.
          </span>
          <button
            onClick={() => setIsAdminLoginModalOpen(true)}
            className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition flex items-center gap-1 text-[11px]"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Connexion Admin</span>
          </button>
        </div>
      )}

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
            {selectedMediaTypeFilter === 'video' ? <Film className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Aucun média ne correspond à vos critères
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Essayez de réinitialiser la recherche ou de changer de filtre pour voir l'ensemble de la galerie.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => {
                setSelectedMediaTypeFilter('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200 transition"
            >
              Réinitialiser les filtres
            </button>
            {isAdminLoggedIn && (
              <button
                onClick={() => handleOpenAddModal('photo', 'single')}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter un média</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMedia.map(item => {
            const isDeleting = deleteConfirmId === item.id;
            const isSelected = selectedMediaIds.includes(item.id);
            const isVideo = item.mediaType === 'video';

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isAdminLoggedIn && selectedMediaIds.length > 0) {
                    toggleSelectMedia(item.id);
                  } else {
                    setActiveMedia(item);
                  }
                }}
                className={`group relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 ${
                  isSelected
                    ? 'border-red-500 ring-2 ring-red-500/40 shadow-xl'
                    : 'border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl'
                }`}
              >
                {/* Media Container with 4:3 Aspect */}
                <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40 opacity-70 group-hover:opacity-90 transition-opacity" />

                  {/* Video Play Icon Overlay */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-13 h-13 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 group-hover:scale-115 transition-transform duration-300 border-2 border-white/40">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Top-Left: Category Pill & Selection Checkbox for Admin */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                    {isAdminLoggedIn && (
                      <button
                        type="button"
                        onClick={e => toggleSelectMedia(item.id, e)}
                        className="w-7 h-7 rounded-lg bg-slate-950/80 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition hover:scale-110"
                        title={isSelected ? 'Désélectionner' : 'Sélectionner'}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-red-500" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                    )}

                    {isVideo ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md bg-amber-500 text-slate-950 flex items-center gap-1">
                        <Film className="w-3 h-3" />
                        <span>Vidéo</span>
                      </span>
                    ) : (
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${getCategoryBadgeColor(
                          item.category
                        )}`}
                      >
                        {getCategoryLabel(item.category)}
                      </span>
                    )}
                  </div>

                  {/* Top-Right: Admin Quick Action Buttons (Edit + Delete) */}
                  {isAdminLoggedIn && (
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={e => handleOpenEditModal(item, e)}
                        className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center backdrop-blur-md shadow-md transition"
                        title={isVideo ? "Modifier cette vidéo" : "Modifier cette photo"}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {isDeleting ? (
                        <div className="flex items-center gap-1 bg-slate-950/95 p-1 rounded-xl shadow-xl border border-red-500 animate-in fade-in">
                          <button
                            onClick={e => handleDelete(item.id, e)}
                            className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[10px] font-black"
                            title="Confirmer la suppression"
                          >
                            Supprimer ?
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setDeleteConfirmId(null);
                            }}
                            className="p-1 rounded-lg bg-slate-800 text-slate-300 text-[10px]"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setDeleteConfirmId(item.id);
                          }}
                          className="w-8 h-8 rounded-xl bg-slate-950/80 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md shadow-md transition"
                          title={isVideo ? "Supprimer la vidéo" : "Supprimer la photo"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Zoom/Play Preview Hover Icon for non-admin */}
                  {!isAdminLoggedIn && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-lg border border-white/30">
                        {isVideo ? <Play className="w-5 h-5 fill-current" /> : <Eye className="w-5 h-5" />}
                      </span>
                    </div>
                  )}

                  {/* Bottom Duration or Date Badge */}
                  <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5">
                    {isVideo && item.duration && (
                      <span className="text-[10px] text-slate-950 font-black flex items-center gap-1 bg-amber-400 px-2 py-0.5 rounded-lg shadow">
                        <Clock className="w-3 h-3" />
                        {item.duration}
                      </span>
                    )}
                    <span className="text-[10px] text-white/90 font-mono font-medium flex items-center gap-1 bg-slate-950/60 backdrop-blur-sm px-2 py-0.5 rounded-lg">
                      <Calendar className="w-3 h-3 text-red-400" />
                      {item.date}
                    </span>
                  </div>
                </div>

                {/* Card Content & Action Footer */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 truncate max-w-[150px]">
                        <Camera className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{item.photographer || clubInfo.shortName}</span>
                      </span>
                      <span className="text-red-600 dark:text-red-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        {isVideo ? 'Lire la vidéo ▶' : 'Agrandir →'}
                      </span>
                    </div>

                    {/* Admin direct edit button on card */}
                    {isAdminLoggedIn && (
                      <div className="flex items-center gap-2 pt-1" onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={e => handleOpenEditModal(item, e)}
                          className="flex-1 py-1.5 px-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-blue-500/20"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>{isVideo ? 'Modifier la vidéo' : 'Modifier la photo'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setDeleteConfirmId(item.id);
                          }}
                          className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 text-xs font-bold transition border border-red-500/20"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Sticky Bulk Actions Bar */}
      {isAdminLoggedIn && selectedMediaIds.length > 0 && (
        <div className="fixed bottom-16 sm:bottom-6 inset-x-4 max-w-xl mx-auto z-40 bg-slate-950 text-white p-4 rounded-3xl border border-red-500/50 shadow-2xl backdrop-blur-lg flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-red-600 text-white font-black flex items-center justify-center text-xs">
              {selectedMediaIds.length}
            </span>
            <span className="text-xs font-bold">
              {selectedMediaIds.length > 1 ? 'Médias sélectionnés' : 'Média sélectionné'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedMediaIds([])}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              Annuler
            </button>
            <button
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer ({selectedMediaIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Supprimer {selectedMediaIds.length} média{selectedMediaIds.length > 1 ? 's' : ''} ?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Cette action retirera définitivement les photos et vidéos sélectionnées de la galerie officielle.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmBulkDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/30"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Video Player Modal */}
      {activeMedia && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setActiveMedia(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[92vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
              <div className="flex items-center gap-2">
                {activeMedia.mediaType === 'video' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md">
                    <Film className="w-3 h-3" />
                    <span>Vidéo Officielle</span>
                  </span>
                ) : (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getCategoryBadgeColor(
                      activeMedia.category
                    )}`}
                  >
                    {getCategoryLabel(activeMedia.category)}
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-red-400" />
                  {activeMedia.date}
                </span>
                {activeMedia.duration && (
                  <span className="text-xs text-amber-400 font-mono flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3" />
                    {activeMedia.duration}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isAdminLoggedIn && (
                  <>
                    <button
                      onClick={() => handleOpenEditModal(activeMedia)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
                      title="Modifier ce média"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Modifier</span>
                    </button>

                    <button
                      onClick={() => handleDelete(activeMedia.id)}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
                      title="Supprimer ce média"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Supprimer</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() =>
                    triggerShare({
                      title: activeMedia.title,
                      text: `${activeMedia.title} - Galerie officielle ${clubInfo.name}`,
                      url: activeMedia.videoUrl || activeMedia.imageUrl,
                    })
                  }
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Partager"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveMedia(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Media Player or Big Image Display */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[250px] sm:min-h-[440px]">
              {activeMedia.mediaType === 'video' ? (
                isYouTubeUrl(activeMedia.videoUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(activeMedia.videoUrl || '')}
                    title={activeMedia.title}
                    className="w-full h-full min-h-[350px] sm:min-h-[450px] border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={activeMedia.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-doing-tricks-with-a-ball-40409-large.mp4'}
                    poster={activeMedia.imageUrl}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[65vh] w-full object-contain mx-auto"
                  />
                )
              ) : (
                <img
                  src={activeMedia.imageUrl}
                  alt={activeMedia.title}
                  className="max-h-[60vh] w-auto max-w-full object-contain mx-auto"
                />
              )}
            </div>

            {/* Footer Details */}
            <div className="p-4 sm:p-6 bg-slate-950/90 border-t border-slate-800 space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">{activeMedia.title}</h2>
              {activeMedia.description && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{activeMedia.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-red-400" />
                  Crédit : <strong>{activeMedia.photographer || 'ASC Dialloré Médias'}</strong>
                </span>

                <div className="flex items-center gap-3">
                  {activeMedia.mediaType === 'video' && activeMedia.videoUrl && (
                    <a
                      href={activeMedia.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Lien source vidéo</span>
                    </a>
                  )}
                  {activeMedia.imageUrl && (
                    <a
                      href={activeMedia.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-400 hover:text-red-300 font-bold underline"
                    >
                      Ouvrir l'image HD
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add / Edit Media Modal (Photo & Video Support) */}
      {isMediaModalOpen && isAdminLoggedIn && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    editingItem
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : mediaType === 'video'
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}
                >
                  {editingItem ? <Edit className="w-5 h-5" /> : mediaType === 'video' ? <Film className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {editingItem
                      ? `Modifier ${editingItem.mediaType === 'video' ? 'la vidéo' : 'la photo'} : ${editingItem.title}`
                      : addMode === 'batch'
                      ? 'Ajouter plusieurs fichiers'
                      : mediaType === 'video'
                      ? 'Ajouter une nouvelle vidéo'
                      : 'Ajouter une nouvelle photo'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {editingItem
                      ? 'Mise à jour du média dans la galerie officielle'
                      : 'Administration officielle de la médiathèque ASC Dialloré'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMediaModalOpen(false);
                  resetMediaForm();
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type selector: Photo vs Vidéo (only when not editing or when user wants to switch) */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setMediaType('photo')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                  mediaType === 'photo'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>📷 Format Photo</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                  mediaType === 'video'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>🎬 Format Vidéo</span>
              </button>
            </div>

            {/* Mode switch (Single vs Batch) when creating */}
            {!editingItem && (
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => setAddMode('single')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    addMode === 'single'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Élément unique</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAddMode('batch')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    addMode === 'batch'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm font-black'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Ajout multiple (Lot)</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSaveMedia} className="space-y-4">
              {/* SINGLE MODE (PHOTO OU VIDÉO) */}
              {addMode === 'single' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Titre de {mediaType === 'video' ? 'la vidéo' : 'la photo'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder={
                        mediaType === 'video'
                          ? 'Ex: Compilation des buts et gestes techniques des Cadets'
                          : 'Ex: Séance de frappes du Capitaine Pape Modou Cissé'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 outline-none font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Catégorie *
                      </label>
                      <select
                        value={category}
                        onChange={e => setCategory(e.target.value as GalleryPhoto['category'])}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none font-medium"
                      >
                        <option value="joueurs">Joueurs</option>
                        <option value="staff">Staff & Direction</option>
                        <option value="equipe">Équipe & Groupe</option>
                        <option value="matchs">Matchs & Résultats</option>
                        <option value="evenements">Événements & Supporters</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Date
                      </label>
                      <input
                        type="text"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        placeholder="Ex: Septembre 2026"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 outline-none font-medium"
                      />
                    </div>
                  </div>

                  {/* VIDEO SPECIFIC INPUTS */}
                  {mediaType === 'video' && (
                    <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-black text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5" />
                          <span>Fichier ou Lien Vidéo (MP4, WebM, YouTube) *</span>
                        </label>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400">Lecteur intégré</span>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          required={!videoUrl}
                          value={videoUrl}
                          onChange={e => setVideoUrl(e.target.value)}
                          placeholder="https://.../video.mp4 ou lien YouTube"
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none font-mono"
                        />
                        <label className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer transition whitespace-nowrap shadow-sm">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Fichier vidéo</span>
                          <input type="file" accept="video/*" onChange={handleVideoFileUpload} className="hidden" />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                            Durée estimée (ex: 01:30)
                          </label>
                          <input
                            type="text"
                            value={duration}
                            onChange={e => setDuration(e.target.value)}
                            placeholder="01:30"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                            Exemples de vidéos sportives :
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {presetVideos.map((pv, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  setVideoUrl(pv.videoUrl);
                                  setImageUrl(pv.imageUrl);
                                  setDuration(pv.duration);
                                  setCategory(pv.category);
                                  if (!title) setTitle(pv.label);
                                }}
                                className="text-[10px] px-2 py-1 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 hover:bg-amber-500 hover:text-slate-950 font-medium transition"
                              >
                                {pv.label.split(' ')[0]} {pv.label.split(' ')[1]}...
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* IMAGE / VIGNETTE SECTION */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {mediaType === 'video'
                        ? "Image de couverture / Vignette de la vidéo (recommandé)"
                        : "URL de la photo ou fichier local *"}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required={mediaType === 'photo'}
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... ou /mon-image.jpg"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 outline-none font-mono"
                      />
                      <label className="px-3.5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Fichier photo</span>
                        <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                      </label>
                    </div>

                    {mediaType === 'photo' && (
                      <div className="mt-2">
                        <span className="text-[10px] text-slate-400 block mb-1">Suggestions rapides de clichés :</span>
                        <div className="flex flex-wrap gap-1.5">
                          {presetPhotos.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setImageUrl(preset.url);
                                setCategory(preset.category);
                                if (!title) setTitle(preset.label);
                              }}
                              className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-500 hover:text-white text-slate-600 dark:text-slate-400 transition"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {imageUrl && (
                      <div className="mt-3 relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
                        <img src={imageUrl} alt="Prévisualisation" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
                          Aperçu vignette
                        </span>
                        {mediaType === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Auteur / Crédit ({mediaType === 'video' ? 'Vidéaste' : 'Photographe'})
                    </label>
                    <input
                      type="text"
                      value={photographer}
                      onChange={e => setPhotographer(e.target.value)}
                      placeholder="Ex: Cellule Média ASCD, Pôle Vidéo Dialloré..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Description / Contexte (optionnel)
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Détails du match, des joueurs présents, séance d'entraînement..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 outline-none font-medium resize-none"
                    />
                  </div>
                </>
              )}

              {/* BATCH MODE (PLUSIEURS FICHIERS) */}
              {addMode === 'batch' && !editingItem && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Catégorie commune pour ce lot *
                      </label>
                      <select
                        value={batchCategory}
                        onChange={e => setBatchCategory(e.target.value as GalleryPhoto['category'])}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white outline-none font-medium"
                      >
                        <option value="joueurs">Joueurs</option>
                        <option value="staff">Staff & Direction</option>
                        <option value="equipe">Équipe & Groupe</option>
                        <option value="matchs">Matchs & Résultats</option>
                        <option value="evenements">Événements & Supporters</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Date commune
                      </label>
                      <input
                        type="text"
                        value={batchDate}
                        onChange={e => setBatchDate(e.target.value)}
                        placeholder="Ex: Septembre 2026"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white outline-none font-medium"
                      />
                    </div>
                  </div>

                  {/* Multiple file picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Téléverser plusieurs fichiers d'un coup (photos ou vidéos)
                    </label>
                    <label className="w-full py-4 border-2 border-dashed border-red-500/40 hover:border-red-500 bg-red-500/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition">
                      <Upload className="w-6 h-6 text-red-500 mb-1" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Cliquez pour sélectionner plusieurs fichiers
                      </span>
                      <span className="text-[11px] text-slate-400">Photos (PNG, JPG, WEBP) ou Vidéos (MP4, WebM)</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleMultipleFilesUpload}
                        className="hidden"
                      />
                    </label>

                    {batchUploadedFiles.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <span className="text-[11px] font-bold text-emerald-500">
                          ✓ {batchUploadedFiles.length} fichier(s) préparé(s) :
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
                          {batchUploadedFiles.map((file, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group">
                              {file.type === 'video' ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-amber-950/40 text-amber-400 p-2">
                                  <Film className="w-6 h-6 mb-1" />
                                  <span className="text-[9px] truncate w-full text-center">{file.title}</span>
                                </div>
                              ) : (
                                <img src={file.url} alt="" className="w-full h-full object-cover" />
                              )}
                              <button
                                type="button"
                                onClick={() => setBatchUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                                className="absolute top-1 right-1 p-1 rounded bg-red-600 text-white text-[10px]"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Or multiple URLs */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ou collez une liste d'URLs d'images ou vidéos (une par ligne)
                    </label>
                    <textarea
                      rows={4}
                      value={batchUrlsText}
                      onChange={e => setBatchUrlsText(e.target.value)}
                      placeholder={`https://images.unsplash.com/photo-1...\nhttps://assets.mixkit.co/.../video.mp4\nhttps://images.unsplash.com/photo-2...`}
                      className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white font-mono outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsMediaModalOpen(false);
                    resetMediaForm();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition ${
                    editingItem
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                      : mediaType === 'video'
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {editingItem
                      ? `Enregistrer les modifications`
                      : addMode === 'batch'
                      ? `Publier le lot de médias`
                      : mediaType === 'video'
                      ? 'Publier la vidéo'
                      : 'Publier la photo'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Quick Login Modal */}
      <AdminQuickLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        title="Connexion Administrateur Galerie"
        description="Connectez-vous pour ajouter, modifier ou supprimer des photos et vidéos de la galerie officielle de l'ASC Dialloré."
      />
    </div>
  );
};
