import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '灵蛙企业级应用平台',
  description: '企业级应用开发框架文档',
  lang: 'zh-CN',

  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'AFG Docs',

    nav: [
      { text: '指南', link: '/guide/' },
      { text: '前端', link: '/frontend/' },
      { text: '后端', link: '/backend/' },
      { text: '框架', link: '/framework/' },
      {
        text: 'GitHub',
        items: [
          { text: 'afg-frontend', link: 'https://github.com/afg-projects/afg-frontend' },
          { text: 'afg-backend', link: 'https://github.com/afg-projects/afg-backend' },
          { text: 'afg-framework', link: 'https://github.com/afg-projects/afg-framework' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '项目结构', link: '/guide/structure' }
          ]
        }
      ],
      '/frontend/': [
        {
          text: '前端文档',
          items: [
            { text: '概述', link: '/frontend/' },
            { text: '技术栈', link: '/frontend/tech-stack' },
            { text: '项目结构', link: '/frontend/structure' },
            { text: '开发指南', link: '/frontend/development' }
          ]
        },
        {
          text: '微前端',
          items: [
            { text: 'qiankun 集成', link: '/frontend/micro-frontend' },
            { text: '微应用开发', link: '/frontend/micro-apps' }
          ]
        }
      ],
      '/backend/': [
        {
          text: '后端文档',
          items: [
            { text: '概述', link: '/backend/' },
            { text: '技术栈', link: '/backend/tech-stack' },
            { text: '项目结构', link: '/backend/structure' },
            { text: '开发指南', link: '/backend/development' }
          ]
        },
        {
          text: '业务模块',
          items: [
            { text: '认证授权', link: '/backend/auth' },
            { text: '系统管理', link: '/backend/system' },
            { text: '组织架构', link: '/backend/organization' }
          ]
        }
      ],
      '/framework/': [
        {
          text: '框架文档',
          items: [
            { text: '概述', link: '/framework/' },
            { text: '核心模块', link: '/framework/core' },
            { text: '数据访问', link: '/framework/data' }
          ]
        },
        {
          text: '中间件集成',
          items: [
            { text: 'Redis', link: '/framework/redis' },
            { text: 'Kafka', link: '/framework/kafka' },
            { text: 'RabbitMQ', link: '/framework/rabbitmq' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/afg-projects' }
    ],

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024-present AFG Projects'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      }
    },

    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    }
  }
})
