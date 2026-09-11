import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors, Glass, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { SkeletonArticleCard } from '@/components/ui/SkeletonLoader';
import { FarmScreen } from '@/components/ui/FarmScreen';

export default function KnowledgeScreen() {
  const router = useRouter();
  const { articles, bookmarkedArticleIds, toggleBookmark, likeArticle } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: 'all', label: 'Lahat ng Karunungan' },
    { id: 'audio_elder', label: 'Tinig ng Nakatatanda (Audio)' },
    { id: 'traditional_practice', label: 'Likas na Pagsugpo sa Peste' },
    { id: 'soil_care', label: 'Pangangalaga sa Lupa at Tubig' },
    { id: 'biodiversity', label: 'Biodiversity at Pollinators' },
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <FarmScreen style={styles.container}>
      <GradientHeader
        title="Sentro ng Tradisyonal na Karunungan"
        subtitle="Mga Kwento at Aral mula sa mga Ninunong Magsasaka"
        gradientVariant="summerVibe"
        rightActionIcon="settings"
        onRightAction={() => router.push('/knowledge-controls')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <AnimatedCard delay={100}>
          <View style={[styles.searchBox, Shadows.subtle]}>
            <IconSymbol name="search" size={18} color={Glass.mutedText} />
            <TextInput
              placeholder="Maghanap ng paksa, kakawate, buwan, o peste..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholderTextColor={BrandColors.mutedText}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <IconSymbol name="close" size={16} color={Glass.mutedText} />
              </TouchableOpacity>
            ) : null}
          </View>
        </AnimatedCard>

        {/* Category Pills */}
        <AnimatedCard delay={150}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                  activeOpacity={0.75}>
                  <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </AnimatedCard>

        {/* Pinned community post */}
        <AnimatedCard delay={200}>
          <View style={styles.featuredSection}>
            <Text style={styles.feedLabel}>NAKA-PIN NA KUWENTO</Text>
            <AudioPlayer
              title="Apo Ramon: Pagbasa sa Buwan at Simoy ng Hangin bago Magtanim"
              speaker="Apo Ramon Delos Santos (74 taong Magsasaka, Nueva Ecija)"
              duration="3:45 min"
            />
          </View>
        </AnimatedCard>

        {/* Pollinator Quick Banner */}
        <AnimatedCard delay={250}>
          <TouchableOpacity
            onPress={() => router.push('/pollinators')}
            activeOpacity={0.85}
            style={[styles.pollinatorBanner, Shadows.subtle]}>
            <View style={styles.pollinatorIconCircle}>
              <IconSymbol name="bee" size={24} color={BrandColors.goldenYellowDark} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pollinatorBannerTitle}>Pollinator & Nature Corner</Text>
              <Text style={styles.pollinatorBannerDesc}>
                Alamin kung paano nakatutulong ang mga bubuyog at putakti sa likas na proteksyon ng palay.
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={18} color={BrandColors.goldenYellowDark} />
          </TouchableOpacity>
        </AnimatedCard>

        {/* Farm knowledge feed */}
        <View style={styles.articlesSection}>
          <View style={styles.feedHeader}>
            <View>
              <Text style={styles.sectionHeaderTitle}>Feed ng Sakahan</Text>
              <Text style={styles.feedSubtext}>{filteredArticles.length} kuwento at gabay para sa bukid</Text>
            </View>
            <View style={styles.feedStatus}><View style={styles.feedStatusDot} /><Text style={styles.feedStatusText}>Latest</Text></View>
          </View>
          {isLoading ? (
            <>
              <SkeletonArticleCard />
              <SkeletonArticleCard />
            </>
          ) : (
            filteredArticles.map((article, index) => {
              const isBookmarked = bookmarkedArticleIds.includes(article.id);
              const isExpanded = expandedArticleId === article.id;

              return (
                <AnimatedCard key={article.id} delay={280 + index * 60}>
                  <View style={[styles.articleCard, Shadows.subtle]}>
                    <View style={styles.articleHeader}>
                      <View style={styles.authorRow}>
                        <View style={styles.authorAvatar}>
                          <IconSymbol
                            name={(article.iconName as IconSymbolName) || 'book.fill'}
                            size={16}
                            color="#A3E635"
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.authorName}>{article.author}</Text>
                          <Text style={styles.authorRole}>{article.role} • {article.location}</Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() => toggleBookmark(article.id)}
                        style={styles.bookmarkBtn}
                        activeOpacity={0.7}>
                        <IconSymbol
                          name="book.fill"
                          size={18}
                          color={isBookmarked ? BrandColors.goldenYellowDark : '#CBD5E1'}
                        />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.articleTitle}>{article.title}</Text>
                    <Text style={styles.articleTagalogTitle}>{article.tagalogTitle}</Text>

                    <Text style={styles.articleSummary}>{article.summary}</Text>

                    {article.mediaUrl ? <Image source={{ uri: article.mediaUrl }} style={styles.articleImage} resizeMode="cover" /> : null}

                    {isExpanded && (
                      <View style={styles.expandedContent}>
                        <Text style={styles.fullText}>{article.content}</Text>
                      </View>
                    )}

                    {/* Tags */}
                    <View style={styles.tagsRow}>
                      {article.tags.map((tag, idx) => (
                        <View key={idx} style={styles.tagPill}>
                          <Text style={styles.tagPillText}>#{tag}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Footer Controls */}
                    <View style={styles.articleFooter}>
                      <View style={styles.footerLeft}>
                        <TouchableOpacity
                          onPress={() => likeArticle(article.id)}
                          style={styles.likeButton}
                          activeOpacity={0.7}>
                          <IconSymbol name="sprout" size={16} color={BrandColors.tealGreen} />
                          <Text style={styles.likeText}>{article.likes} Nakatulong</Text>
                        </TouchableOpacity>
                        <Text style={styles.readTimeText}>• {article.readTime}</Text>
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          setExpandedArticleId(isExpanded ? null : article.id)
                        }
                        activeOpacity={0.7}>
                        <Text style={styles.expandText}>
                          {isExpanded ? 'Itago ↑' : 'Basahin →'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </AnimatedCard>
              );
            })
          )}
        </View>
      </ScrollView>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  searchBox: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 14,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Glass.text,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Glass.surfaceSoft,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  categoryPillActive: {
    backgroundColor: BrandColors.tealGreen,
    borderColor: BrandColors.tealGreen,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: Glass.mutedText,
  },
  categoryTextActive: {
    color: BrandColors.white,
  },
  featuredSection: {
    marginBottom: Spacing.md,
  },
  feedLabel: {
    color: '#A3E635',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
    marginBottom: 2,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Glass.text,
    marginBottom: Spacing.sm,
    letterSpacing: -0.2,
  },
  pollinatorBanner: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  pollinatorIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: BrandColors.goldenYellowLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pollinatorBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Glass.text,
  },
  pollinatorBannerDesc: {
    fontSize: 11,
    color: Glass.mutedText,
    lineHeight: 15,
    marginTop: 2,
  },
  articlesSection: {
    marginTop: Spacing.xs,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  feedSubtext: {
    color: Glass.mutedText,
    fontSize: 10.5,
    marginTop: -5,
  },
  feedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Glass.surfaceSoft,
    borderWidth: 1,
    borderColor: Glass.border,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  feedStatusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#A3E635' },
  feedStatusText: { color: Glass.text, fontSize: 10, fontWeight: '800' },
  articleCard: {
    backgroundColor: Glass.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Glass.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    fontSize: 12,
    fontWeight: '800',
    color: Glass.text,
  },
  authorRole: {
    fontSize: 10.5,
    color: Glass.mutedText,
  },
  bookmarkBtn: {
    padding: 4,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Glass.text,
    marginTop: 4,
  },
  articleTagalogTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#A3E635',
    marginBottom: 6,
  },
  articleSummary: {
    fontSize: 12,
    color: Glass.mutedText,
    lineHeight: 17,
  },
  articleImage: {
    width: '100%',
    height: 170,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
    backgroundColor: Glass.surfaceSoft,
  },
  expandedContent: {
    backgroundColor: Glass.surfaceSoft,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#A3E635',
  },
  fullText: {
    fontSize: 12,
    color: Glass.text,
    lineHeight: 18,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing.sm,
  },
  tagPill: {
    backgroundColor: Glass.surfaceSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Glass.mutedText,
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Glass.border,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A3E635',
  },
  readTimeText: {
    fontSize: 10.5,
    color: Glass.mutedText,
  },
  expandText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#A3E635',
  },
});
