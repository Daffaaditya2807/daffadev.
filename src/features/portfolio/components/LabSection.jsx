import {
  ExternalLink,
  Eye,
  Rotate3D,
  Globe,
} from "lucide-react";
import { useLabSection } from "../hooks/useLabSection";

function LabSection({ selectedProject, setSelectedProject }) {
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
 return (
    <section className="mx-auto max-w-7xl px-4  sm:px-6 lg:px-8">
      <SectionHeader />

      <CategoryFilter
        categories={categories}
        activeFilter={activeFilter}
        onChangeFilter={handleChangeFilter}
      />

      {isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center text-gray-300">
          Memuat portfolio...
        </div>
      ) : errorMessage ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center text-gray-300">
          {errorMessage}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center text-gray-300">
          Belum ada project yang ditampilkan.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelectProject={handleSelectProject}
            />
          ))}
        </div>
      )}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseProject}
        />
      )}
    </section>
  );
}

function SectionHeader() {
  return (
    <div className="mb-16 text-center">
      <h2 className="mb-6 text-4xl font-bold text-white lg:text-5xl">
        Portofolio Proyek
      </h2>

      <p className="mx-auto max-w-3xl text-xl text-gray-300">
        Berikut adalah beberapa proyek aplikasi mobile, web, dan desktop yang
        telah saya kembangkan.
      </p>
    </div>
  );
}

function CategoryFilter({ categories, activeFilter, onChangeFilter }) {
  return (
    <div className="mb-12 flex flex-wrap justify-center gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeFilter === category.id;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChangeFilter(category.id)}
            className={`
              flex items-center gap-2 rounded-full border px-6 py-3
              transition-all duration-300
              ${
                isActive
                  ? "border-white bg-gray-600 text-white shadow-lg shadow-gray-600/25"
                  : "border-white/20 bg-white/5 text-gray-300 hover:border-white/30 hover:bg-white/10"
              }
            `}
          >
            <Icon className="h-5 w-5" />
            {category.label}
          </button>
        );
      })}
    </div>
  );
}

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
          <Rotate3D className="h-4 w-4 text-white" />
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
      <div className="hide-scrollbar max-h-[90vh] max-w-6xl overflow-y-auto rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md">
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
            <Rotate3D className="h-5 w-5" />
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

export default LabSection;
