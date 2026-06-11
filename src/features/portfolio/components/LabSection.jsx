import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Globe,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { memo, useCallback, useMemo, useState } from "react";
import { useLabSection } from "../hooks/useLabSection";


const PROJECTS_PER_PAGE = 6;

function LabSection({ selectedProject, setSelectedProject }) {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    activeFilter,
    categories,
    filteredProjects,
    isLoading,
    errorMessage,
    handleChangeFilter,
    handleSelectProject,
    handleCloseProject,
  } = useLabSection({
    selectedProject,
    setSelectedProject,
  });

  const totalPages = useMemo(() => {
    return Math.max(
      1,
      Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)
    );
  }, [filteredProjects.length]);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;

    return filteredProjects.slice(
      startIndex,
      startIndex + PROJECTS_PER_PAGE
    );
  }, [currentPage, filteredProjects]);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((page) => Math.max(1, page - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  }, [totalPages]);

  const handleFilterChange = useCallback(
    (filterId) => {
      setCurrentPage(1);
      handleChangeFilter(filterId);
    },
    [handleChangeFilter]
  );


 return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeader />

      <CategoryFilter
        categories={categories}
        activeFilter={activeFilter}
        onChangeFilter={handleFilterChange}
      />

      {isLoading ? (
        <StatusBox text="Memuat portfolio..." />
      ) : errorMessage ? (
        <StatusBox text={errorMessage} />
      ) : filteredProjects.length === 0 ? (
        <StatusBox text="Belum ada project yang ditampilkan." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8 p-5 sm:p-2 md:grid-cols-2 lg:grid-cols-3">
            {paginatedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelectProject={handleSelectProject}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <ProjectPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
            />
          )}
        </>
      )}

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={handleCloseProject} />
      )}
    </section>
  );
}

const StatusBox = memo(function StatusBox({ text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center text-gray-300">
      {text}
    </div>
  );
});


const ProjectPagination = memo(function ProjectPagination({
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
}) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={onPreviousPage}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/25 hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        Sebelumnya
      </button>

      <span className="min-w-20 text-center text-sm text-gray-300">
        {currentPage} / {totalPages}
      </span>

      <button
        type="button"
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/25 hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-40"
      >
        Selanjutnya
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
});

const SectionHeader = memo(function SectionHeader() {
  return (
    <div className="mb-8 text-center">
      <h2 className="mb-6 text-4xl font-bold text-white lg:text-5xl">
        Portofolio Proyek
      </h2>

      <p className="mx-auto max-w-3xl text-xl text-gray-300">
        Berikut adalah beberapa proyek aplikasi mobile, web, dan desktop yang
        telah saya kembangkan.
      </p>
    </div>
  );
});

const CategoryFilter = memo(function CategoryFilter({
  categories,
  activeFilter,
  onChangeFilter,
}) {
  return (
    <div className="relative left-1/2 mb-12 w-screen -translate-x-1/2 md:left-0 md:w-full md:translate-x-0">
      <div
        className="
          scrollbar-none flex touch-pan-x flex-nowrap items-center gap-3
          overflow-x-auto overscroll-x-contain px-5 pb-4
          [-webkit-overflow-scrolling:touch] [::-webkit-scrollbar]:hidden
          md:flex-wrap md:justify-center md:px-0 md:pb-0
        "
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeFilter === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChangeFilter(category.id)}
              className={`
                flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm
                transition-all duration-200 active:scale-95
                ${
                  isActive
                    ? "border-white bg-white font-semibold text-black shadow-lg shadow-white/10"
                    : "border-white/10 bg-[#161616] text-gray-400 hover:border-white/20 hover:text-white"
                }
              `}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span className="select-none whitespace-nowrap">
                {category.label}
              </span>
            </button>
          );
        })}

        <div className="w-5 shrink-0 md:hidden" />
      </div>
    </div>
  );
});

function ProjectCard({ project, onSelectProject }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:bg-white/10 hover:shadow-2xl hover:shadow-white/10">
      <div className="relative flex h-80 items-center justify-center p-8">
        <ProjectMockup project={project} onSelectProject={onSelectProject} />
      </div>

      <div className="space-y-4 p-6">
        <div>
          <h3 className="mb-2 text-xl font-bold text-white">
            {project.title}
          </h3>

          <p className="line-clamp-2 text-sm text-gray-300">
            {project.description}
          </p>
        </div>

        <ProjectTechList tech={project.tech} limit={3} />

        <ProjectLinks project={project} onSelectProject={onSelectProject} />
      </div>
    </div>
  );
}

function ProjectMockup({ project, onSelectProject }) {
  if (project.type === "mobile") {
    return (
      <div className="relative h-72 w-48 rounded-[2.5rem] border-4 border-gray-800 bg-gray-900 shadow-2xl">
        <div className="absolute left-1/2 top-2 h-1 w-16 -translate-x-1/2 rounded-full bg-gray-700" />

        <div className="absolute inset-3 overflow-hidden rounded-[1.8rem] bg-white">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
          />

          <ProjectOverlay onClick={() => onSelectProject(project)} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full rounded-xl border-2 border-gray-800 bg-gray-900 p-2 shadow-2xl">
      <WindowDots />

      <div className="h-[calc(100%-1.25rem)] overflow-hidden rounded-md bg-white">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover object-top"
        />

        <ProjectOverlay onClick={() => onSelectProject(project)} />
      </div>
    </div>
  );
}

function ProjectOverlay({ onClick }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-600/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <button
        type="button"
        onClick={onClick}
        className="rounded-full bg-white/20 p-4 backdrop-blur-sm transition-colors hover:bg-white/30"
        aria-label="Lihat detail proyek"
      >
        <Eye className="h-8 w-8 text-white" />
      </button>
    </div>
  );
}

function WindowDots() {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <div className="h-3 w-3 rounded-full bg-red-500" />
      <div className="h-3 w-3 rounded-full bg-yellow-500" />
      <div className="h-3 w-3 rounded-full bg-green-500" />
    </div>
  );
}

function ProjectTechList({ tech, limit }) {
  const visibleTech = limit ? tech.slice(0, limit) : tech;
  const remainingCount = limit ? tech.length - limit : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleTech.map((item) => (
        <span
          key={item}
          className="rounded-full border border-gray-500/30 bg-gray-600/80 px-2 py-1 text-xs text-white"
        >
          {item}
        </span>
      ))}

      {remainingCount > 0 && (
        <span className="rounded-full bg-gray-500/20 px-2 py-1 text-xs text-gray-300">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}

function ProjectLinks({ project, onSelectProject }) {
  return (
    <div className="flex items-center justify-end gap-2 text-sm">
      {project.links.github && (
        <a
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
          aria-label={`Buka GitHub ${project.title}`}
        >
          <FaGithub className="h-4 w-4 text-white" />
        </a>
      )}

      {project.links.website && (
        <a
          href={project.links.website}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
          aria-label={`Buka website ${project.title}`}
        >
          <Globe className="h-4 w-4 text-white" />
        </a>
      )}

      <button
        type="button"
        onClick={() => onSelectProject(project)}
        className="rounded-full bg-gray-600 p-2 transition-colors hover:bg-gray-700"
        aria-label={`Lihat detail ${project.title}`}
      >
        <ExternalLink className="h-4 w-4 text-white" />
      </button>
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      {/* PERUBAHAN UTAMA: 
        Menambahkan [scrollbar-width:none] (untuk Firefox) 
        dan [::-webkit-scrollbar]:hidden (untuk Chrome/Safari/Edge)
      */}
      <div className="max-h-[90vh] max-w-6xl overflow-y-auto rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md scrollbar-none [::-webkit-scrollbar]:hidden">
        <div className="p-8">
          <ModalHeader project={project} onClose={onClose} />

          <div className="grid gap-8 lg:grid-cols-2">
            <ProjectScreenshots project={project} />

            <div className="space-y-6">
              <ProjectFeatures features={project.features} />

              <div>
                <h4 className="mb-4 text-xl font-semibold text-white">
                  Teknologi yang Digunakan
                </h4>

                <ProjectTechList tech={project.tech} />
              </div>

              <ProjectModalLinks links={project.links} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalHeader({ project, onClose }) {
  return (
    <div className="mb-8 flex items-start justify-between gap-6">
      <div>
        <h3 className="mb-2 text-3xl font-bold text-white">
          {project.title}
        </h3>

        <p className="text-justify text-gray-300">
          {project.longDescription}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
        aria-label="Tutup detail proyek"
      >
        <span className="text-xl text-white">✕</span>
      </button>
    </div>
  );
}

function ProjectScreenshots({ project }) {
  const isWidePreview = project.type === "web" || project.type === "desktop";

  return (
    <div>
      <h4 className="mb-4 text-xl font-semibold text-white">Screenshots</h4>

      {isWidePreview ? (
        <div className="space-y-4">
          {project.screenshots.map((screenshot, index) => (
            <div
              key={screenshot}
              className="relative w-full rounded-lg border-2 border-gray-800 bg-gray-900 p-2 shadow-lg"
            >
              <WindowDots />

              <div className="flex items-center justify-center overflow-hidden rounded-md bg-white">
                <img
                  src={screenshot}
                  alt={`${project.title} screenshot ${index + 1}`}
                  className="max-h-75 w-auto"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {project.screenshots.map((screenshot, index) => (
            <div
              key={screenshot}
              className="rounded-2xl border-2 border-gray-800 bg-gray-900 p-2"
            >
              <img
                src={screenshot}
                alt={`${project.title} screenshot ${index + 1}`}
                className="w-full rounded-xl"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectFeatures({ features }) {
  return (
    <div>
      <h4 className="mb-4 text-xl font-semibold text-white">Fitur Utama</h4>

      <ul className="space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-gray-300">
            <span className="h-2 w-2 rounded-full bg-white" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectModalLinks({ links }) {
  const hasLinks = links.github || links.website;

  if (!hasLinks) {
    return null;
  }

  return (
    <div>
      <h4 className="mb-4 text-xl font-semibold text-white">Tautan</h4>

      <div className="flex flex-wrap gap-4">
        {links.github && (
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-gray-700 px-6 py-3 transition-colors hover:bg-gray-600"
          >
            <FaGithub className="h-5 w-5" />
            Source Code
          </a>
        )}

        {links.website && (
          <a
            href={links.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-gray-600 px-6 py-3 transition-colors hover:bg-gray-700"
          >
            <Globe className="h-5 w-5" />
            Kunjungi Situs
          </a>
        )}
      </div>
    </div>
  );
}

export default memo(LabSection);
