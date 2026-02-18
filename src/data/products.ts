export interface Product {
    nameKey: string;
    descKey: string;
    priceKey: string;
    image: string;
    prices: Record<string, number>;
}

export const products: Product[] = [
    { nameKey: 'prod_19_name', descKey: 'prod_19_desc', priceKey: 'prod_19_price', image: '/products/xerjoff.jpg', prices: { 2: 30, 3: 35, 4: 45, 5: 50 } },
    { nameKey: 'prod_17_name', descKey: 'prod_17_desc', priceKey: 'prod_17_price', image: '/products/img_18.jpg', prices: { 2: 10, 3: 15, 4: 20, 5: 25 } },
    { nameKey: 'prod_16_name', descKey: 'prod_16_desc', priceKey: 'prod_16_price', image: '/products/img_17.jpg', prices: { 2: 15, 3: 20, 4: 30, 5: 35 } },
    { nameKey: 'prod_15_name', descKey: 'prod_15_desc', priceKey: 'prod_15_price', image: '/products/img_16.jpg', prices: { 2: 8, 3: 10, 4: 14, 5: 18 } },
    { nameKey: 'prod_14_name', descKey: 'prod_14_desc', priceKey: 'prod_14_price', image: '/products/img_15.jpg', prices: { 2: 15, 3: 20, 4: 25, 5: 30 } },
    { nameKey: 'prod_13_name', descKey: 'prod_13_desc', priceKey: 'prod_13_price', image: '/products/img_14.jpg', prices: { 2: 15, 3: 20, 4: 25, 5: 30 } },
    { nameKey: 'prod_12_name', descKey: 'prod_12_desc', priceKey: 'prod_12_price', image: '/products/img_13.jpg', prices: { 2: 5, 3: 10, 4: 15, 5: 20 } },
    { nameKey: 'prod_11_name', descKey: 'prod_11_desc', priceKey: 'prod_11_price', image: '/products/img_12.jpg', prices: { 2: 15, 3: 25, 4: 30, 5: 35 } },
    { nameKey: 'prod_10_name', descKey: 'prod_10_desc', priceKey: 'prod_10_price', image: '/products/img_11.jpg', prices: { 2: 15, 3: 20, 4: 30, 5: 35 } },
    { nameKey: 'prod_9_name', descKey: 'prod_9_desc', priceKey: 'prod_9_price', image: '/products/img_10.jpg', prices: { 2: 5, 3: 7, 4: 10, 5: 12 } },
    { nameKey: 'prod_8_name', descKey: 'prod_8_desc', priceKey: 'prod_8_price', image: '/products/img_09.jpg', prices: { 2: 3, 3: 5, 4: 10, 5: 12 } },
    { nameKey: 'prod_3_name', descKey: 'prod_3_desc', priceKey: 'prod_3_price', image: '/products/img_08.jpg', prices: { 2: 5, 3: 10, 4: 15, 5: 20 } },
    { nameKey: 'prod_2_name', descKey: 'prod_2_desc', priceKey: 'prod_2_price', image: '/products/img_07.jpg', prices: { 2: 10, 3: 15, 4: 20, 5: 25, 10: 45 } },
    { nameKey: 'prod_1_name', descKey: 'prod_1_desc', priceKey: 'prod_1_price', image: '/products/img_06.jpg', prices: { 2: 10, 3: 15, 4: 20, 5: 25, 10: 40 } },
    { nameKey: 'prod_7_name', descKey: 'prod_7_desc', priceKey: 'prod_7_price', image: '/products/img_05.jpg', prices: { 2: 3, 3: 5, 4: 8, 5: 10, 10: 18 } },
    { nameKey: 'prod_6_name', descKey: 'prod_6_desc', priceKey: 'prod_6_price', image: '/products/zimaya.jpg', prices: { 2: 3, 3: 5, 4: 7, 5: 10, 10: 18 } },
    { nameKey: 'prod_5_name', descKey: 'prod_5_desc', priceKey: 'prod_5_price', image: '/products/img_03.jpg', prices: { 2: 7, 3: 10, 4: 13, 5: 15, 10: 25 } },
    { nameKey: 'prod_18_name', descKey: 'prod_18_desc', priceKey: 'prod_18_price', image: '/products/img_02.jpg', prices: { 2: 5, 3: 7, 4: 10, 5: 12, 10: 20 } },
    { nameKey: 'prod_4_name', descKey: 'prod_4_desc', priceKey: 'prod_4_price', image: '/products/img_01.jpg', prices: { 2: 3, 3: 5, 4: 8, 5: 10, 10: 18 } },
];
