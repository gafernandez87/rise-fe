import { expect, test, type Locator, type Page } from "@playwright/test";

const widths = [360, 390];
const locales = ["es", "en", "pt"];
const sections = ["/", "/mapa", "/perfiles", "/historias", "/informe-regional", "/metodologia"];

function localizedPath(path: string, locale: string) {
  return locale === "es" ? path : `/${locale}${path === "/" ? "" : path}`;
}

async function visit(page: Page, path: string) {
  const response = await page.goto(path);
  expect(response?.ok(), path).toBe(true);
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("h1")).toBeVisible();
}

async function expectContained(page: Page) {
  const result = await page.evaluate(() => {
    const viewport = document.documentElement.clientWidth;
    const outside = [...document.querySelectorAll<HTMLElement>(
      "a, button, input:not([type=hidden]), select, textarea, summary, iframe, video",
    )].filter((element) => {
      if (!element.checkVisibility() || element.closest(".leaflet-container")) return false;
      // Carousels and tables may scroll inside their own bounded container.
      for (let parent = element.parentElement; parent; parent = parent.parentElement) {
        if (["auto", "scroll"].includes(getComputedStyle(parent).overflowX)) return false;
      }
      const box = element.getBoundingClientRect();
      return box.width > 0 && (box.left < -1 || box.right > viewport + 1);
    }).map((element) => `${element.tagName}: ${element.textContent?.trim().slice(0, 80)}`);
    return { viewport, scrollWidth: document.documentElement.scrollWidth, outside };
  });
  expect(result.scrollWidth, "The page must not scroll horizontally").toBeLessThanOrEqual(result.viewport);
  expect(result.outside, "Controls must fit without being clipped by the page").toEqual([]);
}

async function expectLabeledControls(page: Page) {
  const unlabeled = await page.locator("input:not([type=hidden]), select, textarea").evaluateAll(
    (elements) => elements.filter((element) => {
      const field = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (!field.checkVisibility()) return false;
      const labelledBy = field.getAttribute("aria-labelledby")?.split(/\s+/)
        .some((id) => document.getElementById(id)?.textContent?.trim());
      return ![...(field.labels ?? [])].some((label) => label.textContent?.trim())
        && !field.getAttribute("aria-label")?.trim() && !labelledBy;
    }).map((element) => element.outerHTML),
  );
  expect(unlabeled, "Visible fields need a label beyond their placeholder").toEqual([]);
}

async function expectFocusVisible(locator: Locator) {
  await expect(locator).toBeFocused();
  const outline = await locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return { visible: element.matches(":focus-visible"), style: style.outlineStyle,
      width: parseFloat(style.outlineWidth), color: style.outlineColor };
  });
  expect(outline.visible).toBe(true);
  expect(outline.style).not.toBe("none");
  expect(outline.width).toBeGreaterThanOrEqual(2);
  expect(outline.color).not.toBe("rgba(0, 0, 0, 0)");
}

for (const width of widths) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 800 } });

    for (const locale of locales) {
      for (const section of sections) {
        test(`${locale} ${section} fits the screen`, async ({ page }) => {
          await visit(page, localizedPath(section, locale));
          await expectContained(page);
          await expectLabeledControls(page);
          if (section === "/") {
            const preview = page.locator(".rise-map-preview");
            const box = await preview.boundingBox();
            expect(box).not.toBeNull();
            expect(box!.height).toBeCloseTo(box!.width * 3 / 4, 0);
          }
        });
      }

      for (const [listing, prefix] of [["/mapa", "/casos/"], ["/perfiles", "/perfiles/"], ["/historias", "/historias/"]]) {
        test(`${locale} ${prefix} detail fits the screen`, async ({ page }) => {
          await visit(page, localizedPath(listing, locale));
          const href = await page.locator(`main a[href^="${localizedPath(prefix, locale)}"]`).first().getAttribute("href");
          expect(href, "A published detail is needed to verify its layout").toBeTruthy();
          await visit(page, href!);
          await expectContained(page);
        });
      }
    }

    test("mobile navigation supports Tab, Enter, Space and Escape", async ({ page }) => {
      await visit(page, "/");
      await page.keyboard.press("Tab");
      await expectFocusVisible(page.locator(".claac-header__brand"));
      await page.keyboard.press("Tab");
      const toggle = page.locator(".claac-header__toggle");
      await expectFocusVisible(toggle);
      await page.keyboard.press("Enter");
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      for (let index = 0; index < 4; index++) await page.keyboard.press("Tab");
      const academia = page.getByRole("button", { name: "ACADEMIA COP30", exact: true });
      await expectFocusVisible(academia);
      await page.keyboard.press("Tab");
      const rise = page.getByRole("button", { name: "RISE", exact: true });
      await expectFocusVisible(rise); // Closed submenus must not receive focus.
      await page.keyboard.press("Space");
      await expect(rise).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Tab");
      await expectFocusVisible(page.getByRole("link", { name: "Inicio RISE", exact: true }));
      await expectContained(page);
      await page.keyboard.press("Escape");
      await expectFocusVisible(rise);
      await expect(rise).toHaveAttribute("aria-expanded", "false");
      await page.keyboard.press("Escape");
      await expectFocusVisible(toggle);
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await page.keyboard.press("Tab");
      await expectFocusVisible(page.locator(".language-switcher__trigger"));
      await page.keyboard.press("Tab");
      await expect(page.locator('.rise-public > nav[aria-label="RISE"] a').first()).toBeFocused();
    });

    test("language options follow their trigger in keyboard order", async ({ page }) => {
      await visit(page, "/");
      const trigger = page.locator(".language-switcher__trigger");
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      for (const language of ["en", "pt", "es"]) {
        await page.keyboard.press("Tab");
        await expectFocusVisible(page.locator(`.language-switcher a[hreflang="${language}"]`));
      }
      await expectContained(page);
      await page.keyboard.press("Escape");
      await expectFocusVisible(trigger);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await page.keyboard.press("Space");
      for (let index = 0; index < 4; index++) await page.keyboard.press("Tab");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    test("search submits with Enter and long filter text stays contained", async ({ page }) => {
      await visit(page, "/");
      const query = "experiencia".repeat(35);
      const search = page.getByRole("searchbox");
      await search.fill(query);
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(new RegExp(`/mapa\\?q=${query}`));
      await page.waitForLoadState("networkidle");
      await expect(page.locator("button.rounded-full").filter({ hasText: query })).toBeVisible();
      await expectContained(page);
      await expectLabeledControls(page);
      const filters = page.locator(".rise-map-filters");
      const toggle = page.getByRole("button", { name: /^(Ocultar|Mostrar) filtros$/ });
      await toggle.focus();
      await page.keyboard.press("Space");
      await expect(filters).toHaveAttribute("inert", "");
      await page.keyboard.press("Tab");
      await expect(page.locator("button.rounded-full").filter({ hasText: query })).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Shift+Tab");
      await expectFocusVisible(page.getByRole("button", { name: "Ver mapa", exact: true }));
      await page.keyboard.press("Shift+Tab");
      await expectFocusVisible(page.getByRole("button", { name: "Ver lista", exact: true }));
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await expectFocusVisible(toggle);
      await page.keyboard.press("Enter");
      await expect(filters).not.toHaveAttribute("inert", "");
      await page.keyboard.press("Tab");
      await expectFocusVisible(filters.locator("input").first());
    });

    test("carousels scroll locally with the keyboard", async ({ page }) => {
      await visit(page, "/");
      const rail = page.locator(".rise-card-rail").first();
      await rail.focus();
      await page.keyboard.press("ArrowRight");
      await expect.poll(() => rail.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
      await expectContained(page);
    });

    test("map previews keep their focus outline inside the card", async ({ page }) => {
      await visit(page, "/");
      const preview = page.locator(".rise-map-preview");
      await preview.focus();
      await expectFocusVisible(preview);
      await expect(preview).toHaveCSS("outline-offset", "-3px");
    });

    test("interactive map and open case popup fit the screen", async ({ page }) => {
      await visit(page, "/mapa");
      await page.getByRole("button", { name: "Ver mapa", exact: true }).click();
      await expect(page.locator(".leaflet-marker-icon").first()).toBeVisible();
      await page.getByRole("button", { name: "Ubicar en el mapa", exact: true }).first().click();
      const map = page.locator(".leaflet-container");
      const popup = map.locator(".rise-map-popup");
      await expect(map).toBeVisible();
      await expect(popup).toBeVisible();
      await expectContained(page);
      await expect.poll(async () => {
        const mapBox = await map.boundingBox();
        const popupBox = await popup.boundingBox();
        return mapBox && popupBox && popupBox.x >= mapBox.x - 1
          && popupBox.x + popupBox.width <= mapBox.x + mapBox.width + 1;
      }).toBe(true);
    });

    for (const route of ["/admin/login", "/backoffice"]) {
      test(`${route} fields have labels and visible keyboard focus`, async ({ page }) => {
        await visit(page, route);
        await expectContained(page);
        await expectLabeledControls(page);
        const first = page.locator("form input:not([type=hidden])").first();
        await first.focus();
        await page.keyboard.press("Tab");
        await page.keyboard.press("Shift+Tab");
        await expectFocusVisible(first);
      });
    }

    test("admin table scrolls locally instead of clipping columns", async ({ page }) => {
      await visit(page, "/admin/casos");
      const tableRegion = page.getByRole("region", { name: "Casos publicados" });
      await expect(tableRegion).toHaveCSS("overflow-x", "auto");
      await tableRegion.focus();
      await page.keyboard.press("ArrowRight");
      await expect.poll(() => tableRegion.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
      await expectContained(page);
    });
  });
}

for (const width of [320, 720, 721, 767, 768, 769, 1120, 1280, 1440]) {
  test(`homepage also fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await visit(page, "/");
    await expectContained(page);
  });
}

test("desktop submenus hide their links from the keyboard until expanded", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await visit(page, "/");
  for (let index = 0; index < 5; index++) await page.keyboard.press("Tab");
  await expectFocusVisible(page.getByRole("button", { name: "ACADEMIA COP30", exact: true }));
  await page.keyboard.press("Tab");
  const rise = page.getByRole("button", { name: "RISE", exact: true });
  await expectFocusVisible(rise);
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expectFocusVisible(page.getByRole("link", { name: "Inicio RISE", exact: true }));
  await expectContained(page);
  await page.keyboard.press("Escape");
  await expectFocusVisible(rise);
  await expect(rise).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Tab");
  await expectFocusVisible(page.getByRole("link", { name: "POTENCIA TU VOZ", exact: true }));
});

test("expanded mobile menu remains scrollable with a short viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 400 });
  await visit(page, "/");
  await page.getByRole("button", { name: "Abrir menú", exact: true }).click();
  await page.getByRole("button", { name: "RISE", exact: true }).click();
  const nav = page.locator(".claac-header__nav");
  await expect(nav).toHaveCSS("overflow-y", "auto");
  const box = await nav.boundingBox();
  expect(box!.y + box!.height).toBeLessThanOrEqual(400);
  await expectContained(page);
});
