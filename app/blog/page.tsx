
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Tag, ChevronRight, Search } from 'lucide-react';
import { BLOG_POSTS } from '../../constants/blogData';

export default function BlogIndex() {
    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Navbar overlay */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-200">
                            <ArrowLeft size={18} className="text-white" />
                        </div>
                        <span className="font-black text-xl tracking-tighter text-slate-800 uppercase">BACK</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <span className="font-black text-xs text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">PRO ARTICLES (50+)</span>
                    </div>
                </div>
            </nav>

            {/* Hero Header */}
            <section className="pt-32 pb-16 px-6 bg-white border-b border-slate-100">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight uppercase">
                        Pool 8 Live <span className="text-indigo-600">Blog</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Master the tables with the best tips, tutorials, and news from the world of 8 Ball Pool.
                    </p>

                    <div className="mt-10 max-w-xl mx-auto relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl shadow-inner focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-slate-700 font-bold"
                        />
                    </div>
                </div>
            </section>

            {/* Posts Grid */}
            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {BLOG_POSTS.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col"
                        >
                            <div className="h-56 relative overflow-hidden bg-indigo-900">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-md text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                                    <div className="flex items-center gap-1.5"><Clock size={12} /> {post.date}</div>
                                    <div className="flex items-center gap-1.5"><Tag size={12} /> 5 min read</div>
                                </div>

                                <h2 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors mb-4 leading-tight uppercase tracking-tight">
                                    {post.title}
                                </h2>

                                <p className="text-slate-500 font-medium leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto flex items-center text-indigo-600 font-black text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
                                    Read article <ChevronRight size={16} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            {/* Footer CTA */}
            <section className="bg-white py-20 px-6 text-center border-t border-slate-100">
                <h3 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">Ready to test these tips?</h3>
                <Link href="/" className="inline-block bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all">
                    PLAY NOW
                </Link>
            </section>
        </div>
    );
}
