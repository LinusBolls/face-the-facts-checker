import { RenderRule } from "markdown-it/lib/renderer.mjs";
import { env } from "./env";
import { t } from "./i18n";

import MarkdownIt from "markdown-it";

export const copyIcon = `<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11.0833 12.75H4.66666V4.58333H11.0833M11.0833 3.41667H4.66666C4.35724 3.41667 4.06049 3.53958 3.8417 3.75838C3.62291 3.97717 3.49999 4.27391 3.49999 4.58333V12.75C3.49999 13.0594 3.62291 13.3562 3.8417 13.575C4.06049 13.7938 4.35724 13.9167 4.66666 13.9167H11.0833C11.3927 13.9167 11.6895 13.7938 11.9083 13.575C12.1271 13.3562 12.25 13.0594 12.25 12.75V4.58333C12.25 4.27391 12.1271 3.97717 11.9083 3.75838C11.6895 3.53958 11.3927 3.41667 11.0833 3.41667ZM9.33332 1.08333H2.33332C2.0239 1.08333 1.72716 1.20625 1.50837 1.42504C1.28957 1.64384 1.16666 1.94058 1.16666 2.25V10.4167H2.33332V2.25H9.33332V1.08333Z" fill="#EEEEEE"/>
</svg>`;

export const copySuccessIcon = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6.21253 12.2842L2.59003 8.66167L4.24086 7.01083L6.21253 8.98833L11.9759 3.21917L13.6267 4.87L6.21253 12.2842Z" fill="white"/>
</svg>`;

export const closeIcon = `<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.85175 7.49935L11.0834 10.731V11.5827H10.2317L7.00008 8.35102L3.76841 11.5827H2.91675V10.731L6.14841 7.49935L2.91675 4.26768V3.41602H3.76841L7.00008 6.64768L10.2317 3.41602H11.0834V4.26768L7.85175 7.49935Z" fill="#EEEEEE"/>
</svg>`;

export const openFactIcon = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.02018 1.78128V2.94795H11.1143L5.38018 8.68211L6.20268 9.50461L11.9368 3.77045V5.86461H13.1035V1.78128M11.9368 11.1146H3.77018V2.94795H7.85352V1.78128H3.77018C3.12268 1.78128 2.60352 2.30628 2.60352 2.94795V11.1146C2.60352 11.424 2.72643 11.7208 2.94522 11.9396C3.16402 12.1584 3.46076 12.2813 3.77018 12.2813H11.9368C12.2463 12.2813 12.543 12.1584 12.7618 11.9396C12.9806 11.7208 13.1035 11.424 13.1035 11.1146V7.03128H11.9368V11.1146Z" fill="white"/>
</svg>`;

const md = new MarkdownIt();

md.core.ruler.push("only_links", (state) => {
  state.tokens = state.tokens
    .filter((token) => token.type === "inline")
    .map((token) => {
      token.children =
        token.children?.filter(
          (child) =>
            child.type === "link_open" ||
            child.type === "link_close" ||
            child.type === "text"
        ) ?? null;
      return token;
    });
});

const renderFunc: RenderRule = (tokens, idx, options, env, self) => {
  return self.renderToken(tokens, idx, options);
};

const defaultRender = md.renderer.rules.link_open || renderFunc;

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrPush(["target", "_blank"]);

  return defaultRender(tokens, idx, options, env, self);
};

export function FactCard(id: string, text: string, shareLink: string) {
  return `<div
    aria-label="${t("fact_ariaDescription")}"
    data-facts-fact="${id}"
    class="facts-fact"
  >
    <div style="display: flex; align-items: center">
      <a
        href="${env.homepageUrl}"
        target="_blank"
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 100%;
        "
      >
        <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.23789 5.17645C9.6225 5.16512 9.95313 5.22557 10.2473 5.4167C10.7406 5.73706 11.0234 6.18736 11.0439 6.77667C11.0606 7.2655 11.0439 7.75888 11.0439 8.26583C11.1283 8.26583 11.1959 8.27491 11.2613 8.27491C11.8116 8.27491 12.3612 8.27491 12.9115 8.27491C13.2588 8.27491 13.4207 8.46454 13.3599 8.80378C13.1418 10.0338 12.9214 11.0704 12.6979 12.2996C12.6439 12.5943 12.4888 12.7174 12.1833 12.719C11.7227 12.719 11.2628 12.719 10.7733 12.719V16.4966H9.98964V10.914H3.83735V16.4997H3.02405V12.7341C2.93436 12.7303 2.86671 12.7243 2.79602 12.7243C2.40457 12.7243 2.01236 12.7243 1.62015 12.7243C1.31078 12.7197 1.16409 12.6004 1.11012 12.3012C0.901849 11.1527 0.697382 10.2053 0.491394 9.06218C0.475433 8.97603 0.45947 8.88915 0.448069 8.80227C0.401703 8.45245 0.553723 8.27338 0.90413 8.27338C1.36551 8.27338 1.82689 8.27338 2.28827 8.27338H2.49958V8.05504C2.49958 7.30707 2.49958 6.92778 2.50338 6.17981C2.50338 5.86019 2.5201 5.62448 2.71925 5.3487C2.9184 5.07293 2.99821 4.94902 3.20572 4.65587C3.38434 4.40429 3.65265 4.33779 3.8746 4.48966C4.09655 4.64154 4.11633 4.87875 3.92935 5.14243C3.50292 5.74688 3.38358 5.70835 3.38358 6.18509C3.38358 6.58099 3.40182 8.26432 3.40182 8.26432H4.3626V7.79136C4.3626 7.49594 4.3626 7.20051 4.3626 6.90512C4.3778 5.95162 4.99194 5.2792 5.97476 5.16739C5.17818 4.42845 4.87111 3.53542 5.11281 2.48673C5.21959 2.02402 5.45437 1.60019 5.79066 1.2631C6.12695 0.92601 6.55133 0.689083 7.01594 0.579073C7.48052 0.469064 7.96682 0.490352 8.41988 0.640534C8.87297 0.790716 9.27476 1.06381 9.57994 1.42898C10.4252 2.43914 10.4556 4.07338 9.23789 5.17645ZM12.4303 9.06141H1.38375C1.55402 10.0036 1.72124 10.9276 1.88846 11.8569H3.01569V10.639C3.01569 10.3111 3.18976 10.16 3.50596 10.16H10.2967C10.5711 10.16 10.7984 10.4304 10.7984 10.6888C10.7984 11.0772 10.7984 11.464 10.7984 11.869C11.1526 11.869 11.4931 11.8735 11.8329 11.8629C11.8732 11.8629 11.934 11.7874 11.9454 11.7322C11.9993 11.4875 12.0404 11.2389 12.0852 10.9918L12.4303 9.06141ZM5.21466 8.18422H10.2093C10.2093 7.74301 10.2131 7.31613 10.2093 6.88925C10.204 6.37245 9.85585 6.02717 9.33745 6.02643C8.2505 6.02643 7.1633 6.02643 6.07588 6.02643C5.62513 6.02643 5.25953 6.30899 5.22378 6.7487C5.1858 7.22394 5.21466 7.69994 5.21466 8.18422ZM5.87521 3.11307C5.86986 3.34267 5.91034 3.57103 5.99434 3.78496C6.07831 3.99891 6.20413 4.19418 6.36452 4.35949C6.5249 4.5248 6.71665 4.6569 6.92868 4.7481C7.14071 4.8393 7.36884 4.88781 7.59988 4.89085C8.56138 4.89766 9.34279 4.11414 9.3481 3.13498C9.35341 2.15581 8.57281 1.35645 7.62266 1.35267C6.67255 1.3489 5.88279 2.13314 5.87521 3.11307Z" fill="white"/>
        </svg>
        </a>
        <h2
          style="
            padding: 8px 0;
            line-height: 17px;
            color: white;
            font-size: 13px;
            font-weight: 600;
  
            white-space: nowrap;
          "
        >
          ${t("fact_aiCaption")}
        </h2>
        <button aria-label="${t(
          "fact_ariaCopyButton"
        )}" class="facts-icon-button" data-facts-action="copy" style="margin-left: 3px">${copyIcon}</button>
                <a href="${shareLink}" target="_blank" aria-label="${t(
    "fact_ariaCopyButton"
  )}" class="facts-icon-button">${openFactIcon}</a>
        <button aria-label="${t(
          "fact_ariaCloseButton"
        )}" class="facts-icon-button" data-facts-action="close" style="margin-left: auto; margin-right: 3px">${closeIcon}</button>
    </div>
    <p class="facts-fact__body">${md.render(text)}</p>
    <div style="display: flex; gap: 4px; padding: 2px 12px 8px 12px">
      <span style="font-size: 11px; line-height: 20px; font-weight: 400; color: #EEEEEE">${t(
        "fact_isThisHelpful"
      )}</span>
      <div style="display: flex; gap: 4px">
        <button aria-label="${t(
          "fact_helpfulness_yes_aria"
        )}" class="facts-pill-button" data-facts-action="rate-helpfulness" data-facts-helpfulness="yes">${t(
    "fact_helpfulness_yes_label"
  )}</button>
        <button aria-label="${t(
          "fact_helpfulness_somewhat_aria"
        )}" class="facts-pill-button" data-facts-action="rate-helpfulness" data-facts-helpfulness="somewhat">${t(
    "fact_helpfulness_somewhat_label"
  )}</button>
        <button aria-label="${t(
          "fact_helpfulness_no_aria"
        )}" class="facts-pill-button" data-facts-action="rate-helpfulness" data-facts-helpfulness="no">${t(
    "fact_helpfulness_no_label"
  )}</button>
      </div>
    </div>
  </div>`;
}
