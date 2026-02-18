import type { Config } from '$lib/config/_loader'

import {
  faGithub,
  faSquareBluesky,
  faBilibili,
  faSquareTwitter,
  faSteam
} from '@fortawesome/free-brands-svg-icons'
import { faSquareRss } from '@fortawesome/free-solid-svg-icons'
import { fabCustomOsu } from '$lib/utils/custom-icons.svelte'

const siteconfig: Config = {
  profile: {
    name: 'TurboKre (Kre<sup>3</sup>)',
    avatar: 'https://avatars.githubusercontent.com/u/76862878#how.jpg',
    species: 'Cyber Coyote',
    email: '<a href="mailto:contact@kre3.net">contact@kre3.net</a>',
    props: 'kyree@kre3.net',
    career: 'Not a student',
    links: [
      { name: 'GitHub', icon: faGithub, url: 'https://github.com/ohmykreee' },
      { name: 'BlueSky', icon: faSquareBluesky, url: 'https://bsky.app/profile/kreee.bsky.social' },
      { name: 'Bilibili', icon: faBilibili, url: 'https://space.bilibili.com/361507684' },
      { name: 'Blog', icon: faSquareRss, url: 'https://blog.kre3.net' },
      { name: 'Twitter', icon: faSquareTwitter, url: 'https://twitter.com/turbokre' },
      { name: 'Steam', icon: faSteam, url: 'https://steamcommunity.com/id/kreeejiang' },
      { name: 'osu!', icon: fabCustomOsu, url: 'https://osu.ppy.sh/users/27746946' }
    ],
    bg: [
      {
        title: 'test1',
        date: '2026.02.15',
        description: 'Illustration by Slimane-Kadi on Unsplash',
        imgUrl: 'https://images.unsplash.com/vector-1769291971615-fd378bb112bf#why.png',
        theme: '#1a9598',
        width: 1175,
        height: 816
      },
      {
        title: 'test2',
        date: '2026.02.16',
        description: 'Illustration by Free To Dive on Unsplash',
        imgUrl: 'https://images.unsplash.com/vector-1758151882209-4ef9a302b3d1#why.png',
        theme: '#4f9822',
        width: 699,
        height: 381
      },
      {
        title: 'test3',
        date: '2026.02.17',
        description: 'Illustration by Gabriele Romano on Unsplash',
        imgUrl: 'https://images.unsplash.com/vector-1769320709544-0a1505bfddf6#why.png',
        theme: '#38639f',
        width: 698,
        height: 698
      },
      {
        title: 'test4',
        date: '2026.02.18',
        description: 'Illustration by Annie Spratt on Unsplash',
        imgUrl: 'https://images.unsplash.com/vector-1758381178586-984420c9c0c1#why.png',
        theme: '#755179',
        width: 1490,
        height: 1117
      },
      {
        title: 'test5',
        date: '2026.02.19',
        description: 'Illustration by Graficon Stuff on Unsplash',
        imgUrl: 'https://images.unsplash.com/vector-1761569284479-f47d1565f8e0#why.png',
        width: 699,
        height: 524
      }
    ]
  },
  portfolio: [
    {
      title: 'test collection 1',
      description: 'this is a test collection, for test only',
      item: [
        {
          title: 'test1',
          date: '2026.02.15',
          description: 'Illustration by Slimane-Kadi on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1769291971615-fd378bb112bf#why.png',
          theme: '#1a9598',
          width: 1175,
          height: 816
        },
        {
          title: 'test2',
          date: '2026.02.16',
          description: 'Illustration by Free To Dive on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1758151882209-4ef9a302b3d1#why.png',
          theme: '#4f9822',
          width: 699,
          height: 381
        },
        {
          title: 'test3',
          date: '2026.02.17',
          description: 'Illustration by Gabriele Romano on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1769320709544-0a1505bfddf6#why.png',
          theme: '#38639f',
          width: 698,
          height: 698
        },
        {
          title: 'test4',
          date: '2026.02.18',
          description: 'Illustration by Annie Spratt on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1758381178586-984420c9c0c1#why.png',
          theme: '#755179',
          width: 1490,
          height: 1117
        },
        {
          title: 'test5',
          date: '2026.02.19',
          description: 'Illustration by Graficon Stuff on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1761569284479-f47d1565f8e0#why.png',
          width: 699,
          height: 524
        }
      ]
    },
    {
      title: 'test collection 2',
      description: 'this is a test collection, for test only',
      item: [
        {
          title: 'test1',
          date: '2026.02.15',
          description: 'Illustration by Slimane-Kadi on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1769291971615-fd378bb112bf#why.png',
          theme: '#1a9598',
          width: 1175,
          height: 816
        },
        {
          title: 'test2',
          date: '2026.02.16',
          description: 'Illustration by Free To Dive on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1758151882209-4ef9a302b3d1#why.png',
          theme: '#4f9822',
          width: 699,
          height: 381
        },
        {
          title: 'test3',
          date: '2026.02.17',
          description: 'Illustration by Gabriele Romano on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1769320709544-0a1505bfddf6#why.png',
          theme: '#38639f',
          width: 698,
          height: 698
        },
        {
          title: 'test4',
          date: '2026.02.18',
          description: 'Illustration by Annie Spratt on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1758381178586-984420c9c0c1#why.png',
          theme: '#755179',
          width: 1490,
          height: 1117
        },
        {
          title: 'test5',
          date: '2026.02.19',
          description: 'Illustration by Graficon Stuff on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1761569284479-f47d1565f8e0#why.png',
          width: 699,
          height: 524
        }
      ]
    },
    {
      title: 'test collection 3',
      description: 'this is a test collection, for test only',
      item: [
        {
          title: 'test1',
          date: '2026.02.15',
          description: 'Illustration by Slimane-Kadi on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1769291971615-fd378bb112bf#why.png',
          theme: '#1a9598',
          width: 1175,
          height: 816
        },
        {
          title: 'test2',
          date: '2026.02.16',
          description: 'Illustration by Free To Dive on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1758151882209-4ef9a302b3d1#why.png',
          theme: '#4f9822',
          width: 699,
          height: 381
        },
        {
          title: 'test3',
          date: '2026.02.17',
          description: 'Illustration by Gabriele Romano on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1769320709544-0a1505bfddf6#why.png',
          theme: '#38639f',
          width: 698,
          height: 698
        },
        {
          title: 'test4',
          date: '2026.02.18',
          description: 'Illustration by Annie Spratt on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1758381178586-984420c9c0c1#why.png',
          theme: '#755179',
          width: 1490,
          height: 1117
        },
        {
          title: 'test5',
          date: '2026.02.19',
          description: 'Illustration by Graficon Stuff on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1761569284479-f47d1565f8e0#why.png',
          width: 699,
          height: 524
        }
      ]
    },
    {
      title: 'test collection 4',
      description: 'this is a test collection, for test only',
      item: [
        {
          title: 'test1',
          date: '2026.02.15',
          description: 'Illustration by Slimane-Kadi on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1769291971615-fd378bb112bf#why.png',
          theme: '#1a9598',
          width: 1175,
          height: 816
        },
        {
          title: 'test2',
          date: '2026.02.16',
          description: 'Illustration by Free To Dive on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1758151882209-4ef9a302b3d1#why.png',
          theme: '#4f9822',
          width: 699,
          height: 381
        },
        {
          title: 'test3',
          date: '2026.02.17',
          description: 'Illustration by Gabriele Romano on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1769320709544-0a1505bfddf6#why.png',
          theme: '#38639f',
          width: 698,
          height: 698
        },
        {
          title: 'test4',
          date: '2026.02.18',
          description: 'Illustration by Annie Spratt on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1758381178586-984420c9c0c1#why.png',
          theme: '#755179',
          width: 1490,
          height: 1117
        },
        {
          title: 'test5',
          date: '2026.02.19',
          description: 'Illustration by Graficon Stuff on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1761569284479-f47d1565f8e0#why.png',
          width: 699,
          height: 524
        }
      ]
    },
    {
      title: 'test collection 5',
      description: 'this is a test collection, for test only',
      item: [
        {
          title: 'test1',
          date: '2026.02.15',
          description: 'Illustration by Slimane-Kadi on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1769291971615-fd378bb112bf#why.png',
          theme: '#1a9598',
          width: 1175,
          height: 816
        },
        {
          title: 'test2',
          date: '2026.02.16',
          description: 'Illustration by Free To Dive on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1758151882209-4ef9a302b3d1#why.png',
          theme: '#4f9822',
          width: 699,
          height: 381
        },
        {
          title: 'test3',
          date: '2026.02.17',
          description: 'Illustration by Gabriele Romano on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1769320709544-0a1505bfddf6#why.png',
          theme: '#38639f',
          width: 698,
          height: 698
        },
        {
          title: 'test4',
          date: '2026.02.18',
          description: 'Illustration by Annie Spratt on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1758381178586-984420c9c0c1#why.png',
          theme: '#755179',
          width: 1490,
          height: 1117
        },
        {
          title: 'test5',
          date: '2026.02.19',
          description: 'Illustration by Graficon Stuff on Unsplash',
          imgUrl: 'https://images.unsplash.com/vector-1761569284479-f47d1565f8e0#why.png',
          width: 699,
          height: 524
        }
      ]
    }
  ],
  about: {
    title: 'About me',
    content: `
    <h3>This is Woof-Barker</h3>
    Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark Woof Woof Bark Bark
    <h3>Notice</h3>
    If you want you change to your own, please notice that the <b>h</b> tag is start from <b>h3</b>, because the h1 is used for title tab, h2 is used for article title, and the least styled h tag is h4.
    <br /><a href="/">A very nice a tag for testing</a>
    `
  },
  baseurl: 'https://kre3.net'
}

export default siteconfig
