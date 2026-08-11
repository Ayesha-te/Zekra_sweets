export const CATEGORY_CONTENT = {
  cookies: {
    label: "Cookies",
    productCategory: "Cookies",
    description: "Browse cookies from Zekra Sweets, available all over the UAE.",
  },
  rusk: {
    label: "Rusk",
    productCategory: "Rusk",
    description: "Explore rusks from Zekra Sweets, available all over the UAE.",
  },
  puff: {
    label: "Puff",
    productCategory: "Puff",
    description: "Explore puffs from Zekra Sweets, available all over the UAE.",
  },
  sweets: {
    label: "Sweets",
    productCategory: "Sweets",
    description: "Browse sweets from Zekra Sweets, available all over the UAE.",
  },
} as const;

export type CategorySlug = keyof typeof CATEGORY_CONTENT;

export const FAQ_ITEMS = [
  {
    question: "Where is Zekra Sweets located?",
    answer: "Zekra Sweets is on Al Zaher Street, Rumaila 2, Ajman, UAE.",
  },
  {
    question: "How can I contact the bakery?",
    answer:
      "You can contact Zekra Sweets by phone, WhatsApp, or email using the links on the Contact page.",
  },
  {
    question: "How do I see available products and sizes?",
    answer:
      "The Products page shows the catalog currently available online. Available size options and AED prices are shown with each product.",
  },
  {
    question: "Can I choose delivery or pickup?",
    answer:
      "The checkout currently offers delivery and pickup. Delivery locations and charges are shown during checkout before an order is placed.",
  },
] as const;
