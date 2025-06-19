import type { StrapiApp } from "@strapi/strapi/admin";

export default {
  config: {
    locales: ["ru"],
    translations: {
      ru: {
        "Auth.form.welcome.title": `Лесная застава`,
        "Auth.form.welcome.subtitle": "Войдите в свою учётную запись",
        "Content Manager": "Манагер контентика",
        "content-type-builder.plugin.name": "Создание разделов контента",
        "HomePage.header.title": "Здравствуйте, {name}",
        "HomePage.header.subtitle":
          "Добро пожаловать в админ-панель сайта Лесная застава",
        "app.components.LeftMenuLinkContainer.collectionTypes": "Коллекции",
        "app.components.LeftMenuLinkContainer.singleTypes": "",
        "global.home": "Домашняя страница",
        "global.search": "Поиск",
        "app.utils.published": "Опубликованное",
      },
    },
  },
  bootstrap(app: StrapiApp) {
    console.log(app);
  },
};
