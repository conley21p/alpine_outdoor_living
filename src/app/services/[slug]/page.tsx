import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ImageIcon, MessageSquare } from "lucide-react";
import { getServiceBySlug, getOptimizedUrl } from "@/lib/public-data";
import { SiteShell } from "@/components/website/SiteShell";
import { Breadcrumbs } from "@/components/website/Breadcrumbs";

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

  const mainImage = service.imageUrls[0];

  return (
    <SiteShell>
      <div className="relative min-h-screen bg-brand-bgLight">
        {/* Ambient Background Blur */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-brand-primary/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-green-200/20 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:py-24">
          <Breadcrumbs 
            items={[
              { label: "Services", href: "/#services" },
              { label: service.title }
            ]} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
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

              <div className="flex flex-wrap gap-4 pt-4">
                <Link 
                  href={`/services/${params.slug}/projects`}
                  className="group flex items-center gap-3 px-8 py-5 bg-brand-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <ImageIcon className="w-5 h-5" />
                  View all {service.title} Projects
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link 
                  href={`/?service=${encodeURIComponent(service.title)}#contact`}
                  className="flex items-center gap-3 px-8 py-5 bg-white border border-brand-primary/20 text-brand-primary rounded-2xl font-bold text-lg hover:bg-brand-primary/5 active:scale-95 transition-all"
                >
                  <MessageSquare className="w-5 h-5" />
                  Request a Quote
                </Link>
              </div>
            </div>

            {/* Visual Side */}
            <div className="lg:col-span-5 relative group">
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

          {/* Featured Preview Grid */}
          {service.imageUrls.length > 1 && (
            <div className="mt-24 lg:mt-36 space-y-12">
              <div className="flex items-end justify-between border-b border-brand-textDark/5 pb-8">
                 <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-textDark">
                   Project Previews
                 </h2>
                 <Link 
                   href={`/services/${params.slug}/projects`}
                   className="text-brand-primary font-bold hover:underline"
                 >
                   View All →
                 </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                 {service.imageUrls.slice(1, 5).map((img, i) => (
                   <div key={img} className="relative aspect-square rounded-2xl overflow-hidden group shadow-lg">
                      <Image
                        src={getOptimizedUrl(img, 'thumb')}
                        alt={`${service.title} preview ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                      />
                   </div>
                 ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
