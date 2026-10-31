// prisma/seed.ts
// Run with:  npx tsx prisma/seed.ts
import 'dotenv/config';
import * as argon from 'argon2';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Fixed UUIDs so relations line up and the seed can be re-run safely.
const id = (prefix: string, n: number) =>
  `01900000-0000-7000-8000-${prefix}${String(n).padStart(10, '0')}`;

const ID = {
  account: (n: number) => id('a0', n),
  user: (n: number) => id('b0', n),
  balance: (n: number) => id('40', n),
  parentChild: (n: number) => id('50', n),
  pricing: (n: number) => id('60', n),
  category: (n: number) => id('c0', n),
  contentAge: (n: number) => id('d0', n),
  channel: (n: number) => id('e0', n),
  playlist: (n: number) => id('f0', n),
  content: (n: number) => id('10', n),
  question: (n: number) => id('20', n),
  story: (n: number) => id('30', n),
  subscription: (n: number) => id('70', n),
  blocked: (n: number) => id('80', n),
  reaction: (n: number) => id('90', n),
  comment: (n: number) => id('a1', n),
  favorite: (n: number) => id('b1', n),
  view: (n: number) => id('c1', n),
  adsPayment: (n: number) => id('d1', n),
  ad: (n: number) => id('e1', n),
  score: (n: number) => id('f1', n),
};

async function main() {
  const password = await argon.hash('Password123!');

  // ---------- Account ----------
  await prisma.account.createMany({
    skipDuplicates: true,
    data: [
      {
        id: ID.account(1),
        email: 'parent@example.com',
        password,
        accountRole: 'PERSONAL',
        authKey: 'auth-key-1',
      },
      {
        id: ID.account(2),
        email: 'creator@example.com',
        password,
        accountRole: 'BUSINESS',
        authKey: 'auth-key-2',
      },
    ],
  });

  // ---------- User ----------
  await prisma.user.createMany({
    skipDuplicates: true,
    data: [
      {
        id: ID.user(1),
        fullName: 'Sara Parent',
        role: 'PARENT',
        birthdayDate: new Date('1988-04-12'),
        gender: 'FEMALE',
        accountId: ID.account(1),
      },
      {
        id: ID.user(2),
        fullName: 'Omar Child',
        role: 'CHILD',
        birthdayDate: new Date('2016-09-03'),
        gender: 'MALE',
        accountId: ID.account(1),
        pin: '1234',
        profileUrl: 'https://cdn.example.com/p/omar.png',
      },
      {
        id: ID.user(3),
        fullName: 'Lina Child',
        role: 'CHILD',
        birthdayDate: new Date('2019-01-20'),
        gender: 'FEMALE',
        accountId: ID.account(1),
        pin: '4321',
      },
      {
        id: ID.user(4),
        fullName: 'Adam Creator',
        role: 'CREATOR',
        birthdayDate: new Date('1990-07-25'),
        gender: 'MALE',
        accountId: ID.account(2),
      },
    ],
  });

  // ---------- UserBalance ----------
  await prisma.userBalance.createMany({
    skipDuplicates: true,
    data: [
      {
        id: ID.balance(1),
        amount: 125.5,
        creatorId: ID.user(4),
        currency: 'USD',
      },
    ],
  });

  // ---------- ParentsChildren ----------
  await prisma.parentsChildren.createMany({
    skipDuplicates: true,
    data: [
      { id: ID.parentChild(1), parentId: ID.user(1), childId: ID.user(2) },
      { id: ID.parentChild(2), parentId: ID.user(1), childId: ID.user(3) },
    ],
  });

  // ---------- userActionsPricing ----------
  await prisma.userActionsPricing.createMany({
    skipDuplicates: true,
    data: [
      {
        id: ID.pricing(1),
        paymentAmount: 0.01,
        type: 'REACTION',
        currency: 'USD',
      },
      {
        id: ID.pricing(2),
        paymentAmount: 0.02,
        type: 'COMMENT',
        currency: 'USD',
      },
      {
        id: ID.pricing(3),
        paymentAmount: 0.015,
        type: 'ADDTOFAV',
        currency: 'USD',
      },
      {
        id: ID.pricing(4),
        paymentAmount: 0.05,
        type: 'SUBSCRIBE',
        currency: 'USD',
      },
      {
        id: ID.pricing(5),
        paymentAmount: 0.005,
        type: 'VIEW',
        currency: 'USD',
      },
    ],
  });

  // ---------- Category ----------
  await prisma.category.createMany({
    skipDuplicates: true,
    data: [
      { id: ID.category(1), type: 'ENTERTAIMENT', specificType: 'Cartoons' },
      { id: ID.category(2), type: 'EDUCATIONAL', specificType: 'Math' },
      { id: ID.category(3), type: 'EDUCATIONAL', specificType: 'Science' },
    ],
  });

  // ---------- ContentAge ----------
  await prisma.contentAge.createMany({
    skipDuplicates: true,
    data: [
      { id: ID.contentAge(1), startAge: 3, endAge: 6 },
      { id: ID.contentAge(2), startAge: 7, endAge: 10 },
      { id: ID.contentAge(3), startAge: 11, endAge: 14 },
    ],
  });

  // ---------- Channel ----------
  await prisma.channel.createMany({
    skipDuplicates: true,
    data: [
      {
        id: ID.channel(1),
        name: 'Fun Learning',
        description: 'Cartoons and school topics for kids',
        creatorId: ID.user(4),
      },
      {
        id: ID.channel(2),
        name: 'Extra Channel',
        description: 'Second channel',
        creatorId: ID.user(4),
      },
    ],
  });

  // ---------- Playlist ----------
  await prisma.playlist.createMany({
    skipDuplicates: true,
    data: [
      {
        id: ID.playlist(1),
        name: 'Numbers for Beginners',
        description: 'Basic counting videos',
        channelId: ID.channel(1),
        categoryId: ID.category(2),
        contentAgeId: ID.contentAge(1),
      },
    ],
  });

  // ---------- Content ----------
  await prisma.content.createMany({
    skipDuplicates: true,
    data: [
      {
        id: ID.content(1),
        description: 'Funny cat cartoon',
        type: 'VIDEO',
        url: 'https://cdn.example.com/v/cat.mp4',
        hlsurl: 'https://cdn.example.com/hls/cat/index.m3u8',
        status: 'APPROVED',
        channelId: ID.channel(1),
        categoryId: ID.category(1),
        contentAgeId: ID.contentAge(1),
      },
      {
        id: ID.content(2),
        description: 'Dog adventure',
        type: 'VIDEO',
        url: 'https://cdn.example.com/v/dog.mp4',
        hlsurl: 'https://cdn.example.com/hls/dog/index.m3u8',
        status: 'APPROVED',
        channelId: ID.channel(1),
        categoryId: ID.category(1),
        contentAgeId: ID.contentAge(2),
      },
      {
        id: ID.content(3),
        description: 'Counting 1 to 10',
        type: 'VIDEO',
        url: 'https://cdn.example.com/v/count.mp4',
        hlsurl: 'https://cdn.example.com/hls/count/index.m3u8',
        status: 'APPROVED',
        playlistId: ID.playlist(1),
        channelId: ID.channel(1),
        categoryId: ID.category(2),
        contentAgeId: ID.contentAge(1),
      },
      {
        id: ID.content(4),
        description: 'Multiplication table',
        type: 'PHOTO',
        url: 'https://cdn.example.com/i/mult.png',
        status: 'APPROVED',
        channelId: ID.channel(1),
        categoryId: ID.category(2),
        contentAgeId: ID.contentAge(2),
      },
      {
        id: ID.content(5),
        description: 'The solar system',
        type: 'VIDEO',
        url: 'https://cdn.example.com/v/solar.mp4',
        hlsurl: 'https://cdn.example.com/hls/solar/index.m3u8',
        status: 'APPROVED',
        channelId: ID.channel(1),
        categoryId: ID.category(3),
        contentAgeId: ID.contentAge(2),
      },
      {
        id: ID.content(6),
        description: 'Water cycle (pending review)',
        type: 'VIDEO',
        url: 'https://cdn.example.com/v/water.mp4',
        status: 'PENDING',
        channelId: ID.channel(1),
        categoryId: ID.category(3),
        contentAgeId: ID.contentAge(3),
      },
    ],
  });

  // ---------- Content_TF_Questions ----------
  await prisma.content_TF_Questions.createMany({
    skipDuplicates: true,
    data: [
      {
        id: ID.question(1),
        question: 'Is 5 greater than 3?',
        answer: true,
        contentId: ID.content(3),
      },
      {
        id: ID.question(2),
        question: 'Is the Sun a planet?',
        answer: false,
        contentId: ID.content(5),
      },
    ],
  });

  // ---------- Stories ----------
  await prisma.stories.createMany({
    skipDuplicates: true,
    data: [
      {
        id: ID.story(1),
        url: 'https://cdn.example.com/s/story1.mp4',
        status: 'APPROVED',
        description: 'Behind the scenes',
        contentRecord: ID.content(1),
        channelId: ID.channel(1),
        categoryId: ID.category(1),
      },
    ],
  });

  // ---------- Subscription ----------
  await prisma.subscription.createMany({
    skipDuplicates: true,
    data: [
      { id: ID.subscription(1), channelId: ID.channel(1), childId: ID.user(2) },
      { id: ID.subscription(2), channelId: ID.channel(1), childId: ID.user(3) },
    ],
  });

  // ---------- BlockedChannel ----------
  await prisma.blockedChannel.createMany({
    skipDuplicates: true,
    data: [
      { id: ID.blocked(1), channelId: ID.channel(2), childId: ID.user(3) },
    ],
  });

  // ---------- Reaction (needs either contentId or storyId) ----------
  await prisma.reaction.createMany({
    skipDuplicates: true,
    data: [
      { id: ID.reaction(1), childId: ID.user(2), contentId: ID.content(1) },
      { id: ID.reaction(2), childId: ID.user(3), storyId: ID.story(1) },
    ],
  });

  // ---------- Comment ----------
  await prisma.comment.createMany({
    skipDuplicates: true,
    data: [
      {
        id: ID.comment(1),
        childId: ID.user(2),
        contentId: ID.content(1),
        comment: 'I love this cartoon!',
      },
    ],
  });

  // ---------- Favorites ----------
  await prisma.favorites.createMany({
    skipDuplicates: true,
    data: [
      { id: ID.favorite(1), childId: ID.user(2), contentId: ID.content(1) },
      { id: ID.favorite(2), childId: ID.user(3), contentId: ID.content(3) },
    ],
  });

  // ---------- Views ----------
  await prisma.views.createMany({
    skipDuplicates: true,
    data: [
      {
        id: ID.view(1),
        childId: ID.user(2),
        contentId: ID.content(1),
        Type: 'VIDEO',
        WatchTime: '95',
        OriginTime: '120',
      },
      {
        id: ID.view(2),
        childId: ID.user(2),
        contentId: ID.content(4),
        Type: 'PHOTO',
      },
      {
        id: ID.view(3),
        childId: ID.user(3),
        contentId: ID.content(3),
        Type: 'PLAYLIST',
        WatchTime: '300',
        OriginTime: '600',
      },
    ],
  });

  // ---------- AdsPayment ----------
  await prisma.adsPayment.createMany({
    skipDuplicates: true,
    data: [
      { id: ID.adsPayment(1), type: 'PHOTO', amountType: 0.05 },
      { id: ID.adsPayment(2), type: 'VIDEO', amountType: 0.15 },
    ],
  });

  // ---------- Ads ----------
  await prisma.ads.createMany({
    skipDuplicates: true,
    data: [
      {
        id: ID.ad(1),
        url: 'https://cdn.example.com/ads/ad1.mp4',
        hlsurl: 'https://cdn.example.com/hls/ad1/index.m3u8',
        status: 'APPROVED',
        channelId: ID.channel(1),
        paymentId: ID.adsPayment(2),
        contentAgeId: ID.contentAge(2),
      },
    ],
  });

  // ---------- UserCategoryScore (percentages per child sum to 100) ----------
  await prisma.userCategoryScore.createMany({
    skipDuplicates: true,
    data: [
      {
        id: ID.score(1),
        userId: ID.user(2),
        categoryId: ID.category(1),
        categoryScore: 50,
        percentage: 50,
      },
      {
        id: ID.score(2),
        userId: ID.user(2),
        categoryId: ID.category(2),
        categoryScore: 30,
        percentage: 30,
      },
      {
        id: ID.score(3),
        userId: ID.user(2),
        categoryId: ID.category(3),
        categoryScore: 20,
        percentage: 20,
      },
      {
        id: ID.score(4),
        userId: ID.user(3),
        categoryId: ID.category(1),
        categoryScore: 60,
        percentage: 60,
      },
      {
        id: ID.score(5),
        userId: ID.user(3),
        categoryId: ID.category(2),
        categoryScore: 25,
        percentage: 25,
      },
      {
        id: ID.score(6),
        userId: ID.user(3),
        categoryId: ID.category(3),
        categoryScore: 15,
        percentage: 15,
      },
    ],
  });

  console.log('Seed finished');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
