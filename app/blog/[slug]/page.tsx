
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Link2, ChevronLeft } from 'lucide-react';
import { BLOG_POSTS } from '../../../constants/blogData';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | Pool 8 Live Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.image],
            type: 'article',
            publishedTime: post.date,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        }
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-white">
            {/* Scroll Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-50 z-[100]">
                <div className="h-full bg-indigo-600 w-1/3 shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
            </div>

            {/* Navigation Header */}
            <nav className="fixed top-1.5 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/blog" className="flex items-center gap-2 group text-slate-600 hover:text-indigo-600 transition-colors">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm uppercase tracking-widest">All Articles</span>
                    </Link>
                    <div className="flex gap-4">
                        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-indigo-600"><Share2 size={18} /></button>
                    </div>
                </div>
            </nav>

            {/* Hero Header */}
            <header className="pt-32 pb-12 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-block bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-indigo-100">
                        {post.category}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight uppercase">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-6 border-y border-slate-100 py-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black text-sm">
                                P8
                            </div>
                            <div>
                                <div className="text-xs font-black text-slate-800 uppercase tracking-tight">Pool 8 Editorial</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Billiard Specialist</div>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-slate-100"></div>
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                            <Calendar size={14} /> {post.date}
                        </div>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            <div className="max-w-5xl mx-auto px-6 mb-16">
                <div className="aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl relative">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
            </div>

            {/* Content Section */}
            <main className="max-w-3xl mx-auto px-6 pb-24 prose prose-slate prose-indigo lg:prose-xl">
                <div
                    className="font-medium text-slate-700 leading-relaxed space-y-8 blog-content-wrapper"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Author Bio Section - SEO Friendly */}
                <section className="mt-20 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <div className="flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
                        <div className="w-24 h-24 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600">
                            <User size={48} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">About the Author</h3>
                            <p className="text-slate-500 font-medium">
                                Our editorial team is composed of billiard enthusiasts and professionals dedicated to sharing the best 8-ball strategies to elevate your game.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Share Section */}
                <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8">
                    <div className="font-black text-xs text-slate-400 uppercase tracking-widest">Share Article</div>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><Facebook size={18} /></button>
                        <button className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><Twitter size={18} /></button>
                        <button className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><Link2 size={18} /></button>
                    </div>
                </div>
            </main>

            {/* CTA Footer Section */}
            <footer className="bg-slate-900 py-24 px-6 text-center text-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tight">Ready to Dominate the Tables?</h2>
                    <p className="text-slate-400 text-lg mb-10 font-medium max-w-xl mx-auto">
                        Apply these strategies right now and start climbing the global Pool 8 Live rankings.
                    </p>
                    <Link href="/" className="inline-block bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-xl shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all">
                        PLAY NOW
                    </Link>
                </div>
            </footer>
        </article>
    );
}
