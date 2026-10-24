window.addEventListener("DOMContentLoaded", (_event) => {
  // Applies to every app.
  const globalContentCSS = `
    html::-webkit-scrollbar {
      display: none !important;
    }
  `;

  // Window drag strip shared by every immersive header.
  const dragBarCSS = `
    #pake-top-dom:active {
      cursor: grabbing;
      cursor: -webkit-grabbing;
    }

    #pake-top-dom {
      position: fixed;
      background: transparent;
      top: 0;
      width: 100%;
      height: 20px;
      cursor: grab;
      -webkit-app-region: drag;
      user-select: none;
      -webkit-user-select: none;
      z-index: 99999;
    }
  `;

  // Site tweaks only load on their own hosts (and subdomains), so a site
  // packaged by a user never inherits rules written for another app.
  // `content` applies on every platform; `immersive` only under the macOS
  // hidden title bar, where the traffic lights overlap the page.
  const siteStyles = [
    {
      hosts: ["chatgpt.com", "chat.openai.com"],
      immersive: `
        #app-shell-sidebar > div {
          padding-top: 24px;
        }
      `,
    },
    {
      hosts: ["grok.com"],
      immersive: `
        .flex.w-full.h-full.overflow-hidden{
          padding-top:20px;
        }

        #grok-app-root [data-sidebar="sidebar"] {
          padding-top: 24px;
        }
      `,
    },
    {
      hosts: ["chat.deepseek.com"],
      immersive: `
        body:not(.rtl) ._5a20a69 {
          margin-left: 84px;
        }

        .b8812f16 {
          padding-top: 16px;
        }
      `,
    },
    {
      hosts: ["gemini.google.com"],
      immersive: `
        .side-nav-menu-button {
          margin-left: 76px !important;
        }
      `,
    },
    {
      hosts: ["notion.so", "notion.com"],
      immersive: `
        #notion-app .notion-sidebar,#notion-app .notion-topbar{
          padding-top: 20px;
          box-sizing: content-box;
        }
      `,
    },
    {
      hosts: ["excalidraw.com"],
      immersive: `
        #root > .excalidraw-app> .excalidraw-container .App-menu.App-menu_top{
          margin-top: 15px;
        }
      `,
    },
    {
      hosts: ["youtube.com"],
      content: `
        #masthead-ad {
          display: none !important;
        }
      `,
      immersive: `
        #layout > ytmusic-nav-bar{
          padding-top: 20px;
        }

        ytd-masthead>#container.style-scope.ytd-masthead {
          padding-top: 12px;
        }

        #background.ytd-masthead {
          height: 68px;
        }
      `,
    },
    {
      hosts: ["xiaohongshu.com"],
      content: `
        #app > header > div > div.menu,
        #app > div.layout > div.main-container > div.side-bar > li.divider {
          display: none !important;
        }

        #app > header .right .avatar.logged-in{
          opacity: 0;
          transition: opacity 0.3s;
        }

        #app > header .right .avatar.logged-in:hover{
          opacity: 1;
        }

        #global > div.header-container.showSearchBoxOrHeaderFixed > header > div.right > div > div.dropdown-nav{
          display: none;
        }
      `,
      immersive: `
        #app > div.layout > div.header-container.showSearchBoxOrHeaderFixed > header > a {
          padding-top:10px;
        }

        #header-area .logoIcon .user-info{
          padding-top: 20px;
        }

        #global > div.header-container > .mask-paper {
          padding-top: 20px;
        }
      `,
    },
    {
      hosts: ["wx.qq.com", "wx2.qq.com"],
      content: `
        .download_entry,
        .lang, .copyright {
          display: none !important;
        }

        .panel.give_me .nav_view {
          top: 164px !important;
        }
      `,
      immersive: `
        .main > div > div.panel.give_me > div.header {
          padding-top: 30px;
        }
      `,
    },
    {
      hosts: ["v.flomoapp.com"],
      content: `
        #page #footer-wrapper {
          display: none !important;
        }
      `,
    },
    {
      hosts: ["qwerty.kaiyi.cool"],
      content: `
        #root > main > footer.justify-center.ease-in {
          visibility: hidden !important;
        }
      `,
    },
    {
      hosts: ["lizhi.dengdengju.com", "lizhi.turkyden.com"],
      content: `
        #root > div > div.fixed.top-0.left-0.w-64.h-screen.p-10.pb-0.flex.flex-col.justify-between > div > div.space-y-4 > a:nth-child(3) {
          display: none !important;
        }
      `,
    },
  ];

  const hostname = window.location.hostname;
  const matchedSites = siteStyles.filter(({ hosts }) =>
    hosts.some((host) => hostname === host || hostname.endsWith(`.${host}`)),
  );
  const siteCSS = (key) =>
    matchedSites.map((site) => site[key] || "").join("\n");

  const injectStyle = (css, id) => {
    if (typeof window.__PAKE_INJECT_STYLE__ === "function") {
      window.__PAKE_INJECT_STYLE__(css, id);
    } else {
      const styleElement = document.createElement("style");
      styleElement.id = id;
      styleElement.textContent = css;
      document.head.appendChild(styleElement);
    }
  };

  injectStyle(globalContentCSS + siteCSS("content"), "pake-content-style");

  // Top spacing adapts to head-hiding scenarios
  const isMac = /Mac/i.test(navigator.userAgent);
  if (hasImmersiveHeader(window["pakeConfig"])) {
    const topPaddingCSS = isMac
      ? siteCSS("immersive") + dragBarCSS
      : dragBarCSS;
    injectStyle(topPaddingCSS, "pake-top-padding-style");
  }
});
