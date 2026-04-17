import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { getServiceBySlug, getServiceProjects, getOptimizedUrl } from "@/lib/public-data";
import { SiteShell } from "@/components/website/SiteShell";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return { title: "Gallery Not Found" };

  return {
    title: `${service.title} Projects | Gallery`,
    description: `Explore our complete portfolio of ${service.title} projects.`,
  };
}

export default async function ServiceProjectsPage({ params }: Props) {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const images = await getServiceProjects(service.folder);

  return (
    <SiteShell>
      <div className="relative min-h-screen bg-brand-bgLight">
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:py-24">
          <Breadcrumbs 
            items={[
              { label: "Services", href: "/#services" },
              { label: service.title, href: `/services/${params.slug}` },
              { label: "Projects" }
            ]} 
          />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 lg:mb-24">
            <div className="max-w-3xl space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter text-brand-textDark leading-tight">
                {service.title} Projects
              </h1>
              <p className="text-lg lg:text-xl text-brand-textDark/60 leading-relaxed">
                A complete showcase of our work in <strong>{service.title}</strong> throughout Central Illinois. 
                Each project represents our commitment to precision, artistry, and environmental harmony.
              </p>
            </div>

            <Link 
              href={`/?service=${encodeURIComponent(service.title)}#contact`}
              className="group flex items-center gap-3 px-8 py-5 bg-brand-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap"
            >
              <MessageSquare className="w-5 h-5" />
              Build Your Sanctuary
            </Link>
          </div>

          {/* Full Gallery Grid */}
          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {images.map((img, i) => (
                <div 
                  key={img.url} 
                  className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-brand-bgLight shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <Image
                    src={getOptimizedUrl(img.url, 'full')}
                    alt={`${service.title} project image ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Image Detail Badge */}
                  <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-brand-textDark shadow-lg border border-white/50 inline-block">
                      Alpine Build No. {1000 + i}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
               <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mb-6">
                  <ImageIcon className="w-8 h-8 text-brand-primary/40" />
               </div>
               <h3 className="text-2xl font-bold text-brand-textDark">No Projects Found</h3>
               <p className="text-brand-textDark/60 mt-2">We are currently gathering media for this category. Check back soon!</p>
               <Link href="/services" className="mt-8 text-brand-primary font-bold hover:underline">
                  Back to Services
               </Link>
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="mt-20 lg:mt-32 pt-12 border-t border-brand-textDark/5 flex flex-col md:flex-row items-center justify-between gap-8">
             <Link 
               href={`/services/${params.slug}`}
               className="flex items-center gap-2 text-brand-textDark/60 hover:text-brand-primary font-bold transition-colors"
             >
               <ArrowLeft className="w-5 h-5" />
               Back to {service.title} Details
             </Link>
             
             <p className="text-sm font-medium text-brand-textDark/40 italic">
               All photography captures authentic Alpine Outdoor Living projects.
             </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
