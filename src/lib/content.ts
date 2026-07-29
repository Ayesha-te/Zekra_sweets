export const CATEGORY_CONTENT = {
  cookies: {
    label: "Cookies",
    productCategory: "Cookies",
    description: "Browse the cookie selection currently available from Zekra Sweets in Ajman.",
  },
  rusk: {
    label: "Rusk",
    productCategory: "Rusk",
    description: "Explore the rusk selection currently available from Zekra Sweets in Ajman.",
  },
  puff: {
    label: "Puff",
    productCategory: "Puff",
    description: "Explore the puff selection currently available from Zekra Sweets in Ajman.",
  },
  sweets: {
    label: "Sweets",
    productCategory: "Sweets",
    description: "Browse the sweets currently available from Zekra Sweets in Ajman.",
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
