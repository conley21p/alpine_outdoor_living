import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, ArrowDown, ImageIcon } from "lucide-react";
import { getServiceBySlug, getServiceProjects, getOptimizedUrl } from "@/lib/public-data";
import { SiteShell } from "@/components/website/SiteShell";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";
import { ServiceQuoteButton } from "@/components/website/ServiceQuoteButton";
import { StaggeredGallery } from "@/components/website/StaggeredGallery";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return { title: "Service Not Found" };

  return {
    title: service.title,
    description: service.description.substring(0, 160),
  };
}

export default async function ServicePage({ params }: Props) {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const allProjects = await getServiceProjects(service.folder);
  const mainImage = service.imageUrls[0];

  return (
    <SiteShell>
      <div id="top" className="relative min-h-screen bg-brand-bgLight scroll-mt-20">
        {/* Ambient Background Blur */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-brand-primary/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-green-200/20 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:py-24">
          <Breadcrumbs 
            items={[
              { label: "Services", href: "/#services" },
              { label: service.title, href: "#top" }
            ]} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mb-24 lg:mb-32">
            {/* Content Side */}
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-brand-textDark leading-[1.05]">
                  {service.title}
                </h1>
                <div className="h-1.5 w-24 bg-brand-primary rounded-full" />
              </div>

              <p className="text-xl lg:text-2xl text-brand-textDark/80 leading-relaxed font-medium">
                {service.description}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
                <Link 
                  href="#gallery"
                  className="group flex flex-col items-start gap-1 transition-all"
                >
                  <span className="text-sm font-bold uppercase tracking-widest text-brand-primary px-1">
                    View all {service.title} projects below
                  </span>
                  <div className="flex items-center justify-center w-12 h-12 bg-white border border-brand-primary/20 rounded-full shadow-lg text-brand-primary animate-bounce mt-2 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    <ArrowDown className="w-6 h-6" />
                  </div>
                </Link>

                <div className="h-12 w-px bg-brand-textDark/10 hidden sm:block mx-4" />

                <ServiceQuoteButton serviceTitle={service.title} />
              </div>
            </div>

            {/* Visual Side - Hidden on Mobile */}
            <div className="hidden lg:block lg:col-span-5 relative group">
               <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
                  {mainImage && (
                    <Image
                      src={getOptimizedUrl(mainImage, 'full')}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                      unoptimized
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
               </div>

               {/* Decorative floating square */}
               <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-brand-primary/10 backdrop-blur-3xl border border-white/40 rounded-3xl -z-10 hidden lg:block" />
            </div>
          </div>

          {/* Full Project Gallery Integrated Directly */}
          <div id="gallery" className="space-y-16 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-brand-textDark/5 pb-12">
               <div className="space-y-4">
                 <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-brand-textDark">
                   Project Gallery
                 </h2>
                 <p className="text-lg text-brand-textDark/60 max-w-2xl">
                   Explore our portfolio of curated <strong>{service.title}</strong> installations. 
                   Each build is a testament to our commitment to artistry and precision.
                 </p>
               </div>
               
            </div>

            <StaggeredGallery 
              images={allProjects} 
              serviceTitle={service.title} 
            />
            
            <div className="flex items-center justify-center pt-20">
               <Link 
                  href={`/?service=${encodeURIComponent(service.title)}#contact`}
                  className="group flex flex-col items-center gap-4 text-center"
               >
                  <p className="text-2xl lg:text-3xl font-bold tracking-tight text-brand-textDark max-w-md uppercase">
                    Like what you see?
                  </p>
                  <div className="px-12 py-5 bg-brand-primary text-white rounded-[2rem] font-bold text-xl shadow-2xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all">
                    Start Your Project
                  </div>
               </Link>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
