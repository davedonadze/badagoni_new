"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";
import { WineryScrollScene } from "../story/winery-scroll-scene";
import { BreakableParagraphs } from "../breakable-paragraphs";
import { localize, type Locale } from "@/lib/i18n";
import type { HeritageChapter } from "@/lib/pages/georgian-wine";

function PhotoCredit({ credit, locale }: { credit: NonNullable<HeritageChapter["credit"]>; locale: Locale }) {
  return <Popover>
    <PopoverTrigger asChild><button className="heritage-credit-trigger" aria-label="Photo credit" title="Photo credit"><Info size={18} strokeWidth={1.5} /></button></PopoverTrigger>
    <PopoverContent className="heritage-credit-popover" align="end" sideOffset={8} aria-label="Photo credit">
      <p className="heritage-credit-title">Photo credit</p>
      <p><a href={credit.url} target="_blank" rel="noreferrer">{localize(credit.label, locale)}</a></p>
      <p><a href={credit.licenseUrl} target="_blank" rel="noreferrer">{localize(credit.license, locale)}</a> · Cropped for display.</p>
    </PopoverContent>
  </Popover>;
}

function ChapterPanel({ number, chapter, sceneClassName, locale }: { number: "01" | "02"; chapter: HeritageChapter; sceneClassName: string; locale: Locale }) {
  const titleId = `heritage-title-${number}`;
  return <WineryScrollScene className={`heritage-scroll-scene ${sceneClassName}`} image={{
    src: chapter.image,
    alt: localize(chapter.imageTitle, locale),
    title: localize(chapter.imageTitle, locale),
    caption: localize(chapter.imageCaption, locale),
  }} imageOverlay={chapter.credit ? <PhotoCredit credit={chapter.credit} locale={locale} /> : undefined} intro={
    <section className="science-section story-winery-copy heritage-copy" aria-labelledby={titleId}>
      <p className="eyebrow">{localize(chapter.eyebrow, locale)}</p>
      <h2 id={titleId}>{localize(chapter.title, locale)}</h2>
      <div><BreakableParagraphs text={localize(chapter.body, locale)} /></div>
    </section>
  } />;
}

export function HeritageTabs({ figure, qvevri, locale }: { figure: HeritageChapter; qvevri: HeritageChapter; locale: Locale }) {
  return <Tabs defaultValue="badagoni-figure" activationMode="manual" className="heritage-tabs">
    <TabsList variant="line" className="heritage-index" aria-label="Explore Georgian wine">
      <TabsTrigger value="badagoni-figure" className="heritage-tab"><span aria-hidden="true">01</span>{localize(figure.tabLabel, locale)}</TabsTrigger>
      <TabsTrigger value="qvevri-tradition" className="heritage-tab"><span aria-hidden="true">02</span>{localize(qvevri.tabLabel, locale)}</TabsTrigger>
    </TabsList>

    <TabsContent value="badagoni-figure" className="heritage-panel">
      <ChapterPanel number="01" chapter={figure} sceneClassName="heritage-figure-scene" locale={locale} />
    </TabsContent>

    <TabsContent value="qvevri-tradition" className="heritage-panel">
      <ChapterPanel number="02" chapter={qvevri} sceneClassName="heritage-qvevri-scene" locale={locale} />
    </TabsContent>
  </Tabs>;
}
