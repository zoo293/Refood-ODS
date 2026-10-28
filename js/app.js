/* =============================================
   REFOOD PERÚ — app.js  (v2)
   Core utilities, seed data, navbar, toast
   ============================================= */
'use strict';

// ─── DATOS DE PRUEBA AMPLIADOS ───────────────────────────────
const SEED_BUSINESSES = [
  // ── SUPERMERCADOS ──
  { id:'b1',  name:'Plaza Vea San Isidro',     type:'supermercado', address:'Av. Javier Prado Este 180, San Isidro',      district:'San Isidro',   lat:-12.0927, lng:-77.0312, phone:'01-234-5678', email:'sanisidro@plazavea.pe',    logo:'🏪', rating:4.5 },
  { id:'b2',  name:'Plaza Vea La Molina',      type:'supermercado', address:'Av. La Molina 1198, La Molina',              district:'La Molina',    lat:-12.0804, lng:-76.9379, phone:'01-234-5679', email:'lamolina@plazavea.pe',     logo:'🏪', rating:4.4 },
  { id:'b3',  name:'Tottus Miraflores',        type:'supermercado', address:'Av. Reducto 1270, Miraflores',               district:'Miraflores',   lat:-12.1200, lng:-77.0282, phone:'01-345-6789', email:'miraflores@tottus.pe',     logo:'🛒', rating:4.3 },
  { id:'b4',  name:'Tottus San Borja',         type:'supermercado', address:'Av. San Luis 1901, San Borja',               district:'San Borja',    lat:-12.1010, lng:-76.9980, phone:'01-345-6790', email:'sanborja@tottus.pe',       logo:'🛒', rating:4.2 },
  { id:'b5',  name:'Metro Surco',              type:'supermercado', address:'Av. Caminos del Inca 198, Surco',            district:'Surco',        lat:-12.1320, lng:-76.9950, phone:'01-456-7890', email:'surco@metro.pe',           logo:'🏬', rating:4.2 },
  { id:'b6',  name:'Metro Jesús María',        type:'supermercado', address:'Av. Brasil 1400, Jesús María',               district:'Jesús María',  lat:-12.0810, lng:-77.0510, phone:'01-456-7891', email:'jesusmaria@metro.pe',      logo:'🏬', rating:4.1 },
  { id:'b7',  name:'Wong La Molina',           type:'supermercado', address:'Av. La Molina 1198, La Molina',              district:'La Molina',    lat:-12.0820, lng:-76.9400, phone:'01-567-8901', email:'lamolina@wong.pe',         logo:'🛍️', rating:4.6 },
  { id:'b8',  name:'Wong Miraflores',          type:'supermercado', address:'Av. Benavides 495, Miraflores',              district:'Miraflores',   lat:-12.1080, lng:-77.0250, phone:'01-567-8902', email:'miraflores@wong.pe',       logo:'🛍️', rating:4.5 },
  { id:'b9',  name:'Mass Lince',               type:'supermercado', address:'Av. Arenales 750, Lince',                   district:'Lince',        lat:-12.0870, lng:-77.0370, phone:'01-678-9012', email:'lince@mass.pe',            logo:'🏪', rating:4.0 },
  { id:'b10', name:'Mass Callao',              type:'supermercado', address:'Av. Sáenz Peña 204, Callao',                district:'Callao',       lat:-12.0550, lng:-77.1180, phone:'01-678-9013', email:'callao@mass.pe',           logo:'🏪', rating:3.9 },
  // ── TIENDAS DE CONVENIENCIA ──
  { id:'b11', name:'Tambo Barranco',           type:'tienda',       address:'Av. Grau 498, Barranco',                    district:'Barranco',     lat:-12.1490, lng:-77.0210, phone:'01-789-0123', email:'barranco@tambo.pe',        logo:'🏪', rating:4.1 },
  { id:'b12', name:'Tambo Magdalena',          type:'tienda',       address:'Jr. Juan Fanning 510, Magdalena',           district:'Magdalena',    lat:-12.0940, lng:-77.0680, phone:'01-789-0124', email:'magdalena@tambo.pe',       logo:'🏪', rating:4.0 },
  { id:'b13', name:'Tambo Los Olivos',         type:'tienda',       address:'Av. Universitaria 3980, Los Olivos',        district:'Los Olivos',   lat:-11.9900, lng:-77.0700, phone:'01-789-0125', email:'losolivos@tambo.pe',       logo:'🏪', rating:3.9 },
  { id:'b14', name:'Tambo San Miguel',         type:'tienda',       address:'Av. La Marina 2355, San Miguel',            district:'San Miguel',   lat:-12.0780, lng:-77.0900, phone:'01-789-0126', email:'sanmiguel@tambo.pe',       logo:'🏪', rating:4.0 },
  // ── RESTAURANTES ──
  { id:'b15', name:'La Lucha Sanguchería Miraflores', type:'restaurante', address:'Av. Benavides 322, Miraflores',      district:'Miraflores',   lat:-12.1090, lng:-77.0220, phone:'01-890-1234', email:'miraflores@lalucha.pe',    logo:'🥪', rating:4.7 },
  { id:'b16', name:'Bembos San Isidro',        type:'restaurante',  address:'Av. Conquistadores 130, San Isidro',       district:'San Isidro',   lat:-12.0960, lng:-77.0350, phone:'01-890-1235', email:'sanisidro@bembos.pe',      logo:'🍔', rating:4.3 },
  { id:'b17', name:'Papa Johns Surco',         type:'restaurante',  address:'Av. Primavera 650, Surco',                 district:'Surco',        lat:-12.1200, lng:-77.0000, phone:'01-901-2345', email:'surco@papajohns.pe',       logo:'🍕', rating:4.2 },
  { id:'b18', name:'Pollo a la Brasa "El Rey" San Borja', type:'restaurante', address:'Av. Javier Prado Este 3490, San Borja', district:'San Borja', lat:-12.0990, lng:-76.9850, phone:'01-901-2346', email:'sanborja@elrey.pe', logo:'🍗', rating:4.5 },
  // ── PANADERÍAS / CAFETERÍAS ──
  { id:'b19', name:'Panadería La Ideal Barranco', type:'panaderia',  address:'Av. Pedro de Osma 135, Barranco',         district:'Barranco',     lat:-12.1520, lng:-77.0230, phone:'01-012-3456', email:'barranco@laideal.pe',      logo:'🥐', rating:4.6 },
  { id:'b20', name:'Starbucks Miraflores',      type:'cafeteria',    address:'Av. Larco 345, Miraflores',               district:'Miraflores',   lat:-12.1280, lng:-77.0310, phone:'01-012-3457', email:'miraflores@starbucks.pe',   logo:'☕', rating:4.4 },
  { id:'b21', name:'Panadería Alemana San Isidro', type:'panaderia', address:'Av. Dos de Mayo 298, San Isidro',         district:'San Isidro',   lat:-12.0900, lng:-77.0380, phone:'01-234-5680', email:'sanisidro@alemana.pe',     logo:'🍞', rating:4.8 },
  { id:'b22', name:'Don Mamino Surco',          type:'cafeteria',    address:'Av. Benavides 1555, Surco',               district:'Surco',        lat:-12.1350, lng:-77.0050, phone:'01-234-5681', email:'surco@donmamino.pe',       logo:'☕', rating:4.3 },
];

const SEED_OFFERS = [
  // Plaza Vea San Isidro
  { id:'o1',  businessId:'b1', businessName:'Plaza Vea San Isidro',    name:'Yogurt Gloria Fresa x4 pack',         category:'lácteos',    emoji:'🥛', originalPrice:18.50, discountPrice:7.00,  expiryDate:daysFromToday(1), stock:5,  description:'Pack de 4 yogurts de fresa próximos a vencer.', active:true },
  { id:'o2',  businessId:'b1', businessName:'Plaza Vea San Isidro',    name:'Ensalada Mixta Lista 300g',            category:'verduras',   emoji:'🥗', originalPrice:11.00, discountPrice:3.80,  expiryDate:daysFromToday(0), stock:6,  description:'Mezcla de lechugas frescas, lista para servir.', active:true },
  { id:'o3',  businessId:'b1', businessName:'Plaza Vea San Isidro',    name:'Jugo Naranja Don Francisco 1L',        category:'bebidas',    emoji:'🍊', originalPrice:12.00, discountPrice:4.50,  expiryDate:daysFromToday(2), stock:8,  description:'Jugo de naranja natural embotellado.', active:true },
  { id:'o4',  businessId:'b1', businessName:'Plaza Vea San Isidro',    name:'Pollo Entero Refrigerado (kg)',        category:'carnes',     emoji:'🍗', originalPrice:24.00, discountPrice:9.50,  expiryDate:daysFromToday(0), stock:3,  description:'Pollo entero fresco, mismo día de vencimiento.', active:true },
  // Plaza Vea La Molina
  { id:'o5',  businessId:'b2', businessName:'Plaza Vea La Molina',     name:'Leche Gloria Entera x6 cajas',        category:'lácteos',    emoji:'🥛', originalPrice:22.00, discountPrice:9.00,  expiryDate:daysFromToday(1), stock:5,  description:'Pack de 6 cajas de leche entera.', active:true },
  { id:'o6',  businessId:'b2', businessName:'Plaza Vea La Molina',     name:'Mango Edward (kg)',                   category:'frutas',     emoji:'🥭', originalPrice:8.00,  discountPrice:2.90,  expiryDate:daysFromToday(1), stock:10, description:'Mangos maduros de temporada.', active:true },
  { id:'o7',  businessId:'b2', businessName:'Plaza Vea La Molina',     name:'Queso Edam Laive 500g',               category:'lácteos',    emoji:'🧀', originalPrice:22.00, discountPrice:8.00,  expiryDate:daysFromToday(2), stock:4,  description:'Queso Edam ideal para sándwiches.', active:true },
  // Tottus Miraflores
  { id:'o8',  businessId:'b3', businessName:'Tottus Miraflores',       name:'Pan de Molde Bimbo Integral',         category:'panadería',  emoji:'🍞', originalPrice:9.90,  discountPrice:3.50,  expiryDate:daysFromToday(1), stock:8,  description:'Pan de molde integral, listo para llevar.', active:true },
  { id:'o9',  businessId:'b3', businessName:'Tottus Miraflores',       name:'Queso Fresco Laive 500g',             category:'lácteos',    emoji:'🧀', originalPrice:15.00, discountPrice:5.50,  expiryDate:daysFromToday(2), stock:7,  description:'Queso fresco ideal para desayunos.', active:true },
  { id:'o10', businessId:'b3', businessName:'Tottus Miraflores',       name:'Chicha Morada Inka Kola 2L',          category:'bebidas',    emoji:'🍹', originalPrice:8.50,  discountPrice:3.00,  expiryDate:daysFromToday(3), stock:11, description:'Bebida chicha morada sabor original.', active:true },
  { id:'o11', businessId:'b3', businessName:'Tottus Miraflores',       name:'Pechuga de Pollo filetes (500g)',     category:'carnes',     emoji:'🍖', originalPrice:16.00, discountPrice:5.90,  expiryDate:daysFromToday(0), stock:4,  description:'Filetes de pechuga listos para cocinar.', active:true },
  // Tottus San Borja
  { id:'o12', businessId:'b4', businessName:'Tottus San Borja',        name:'Plátanos de Seda (kg)',               category:'frutas',     emoji:'🍌', originalPrice:5.00,  discountPrice:1.80,  expiryDate:daysFromToday(2), stock:10, description:'Plátanos maduros perfectos para batidos.', active:true },
  { id:'o13', businessId:'b4', businessName:'Tottus San Borja',        name:'Tomates Cherry (250g)',               category:'verduras',   emoji:'🍅', originalPrice:8.00,  discountPrice:2.90,  expiryDate:daysFromToday(1), stock:12, description:'Tomates cherry frescos para ensaladas.', active:true },
  { id:'o14', businessId:'b4', businessName:'Tottus San Borja',        name:'Mantequilla Gloria 200g',             category:'lácteos',    emoji:'🧈', originalPrice:12.00, discountPrice:4.50,  expiryDate:daysFromToday(2), stock:6,  description:'Mantequilla sin sal para repostería y cocina.', active:true },
  // Metro Surco
  { id:'o15', businessId:'b5', businessName:'Metro Surco',             name:'Manzanas Fuji (1kg)',                 category:'frutas',     emoji:'🍎', originalPrice:7.50,  discountPrice:2.50,  expiryDate:daysFromToday(3), stock:9,  description:'Manzanas fuji frescas importadas.', active:true },
  { id:'o16', businessId:'b5', businessName:'Metro Surco',             name:'Espinaca Fresca (bolsa 250g)',        category:'verduras',   emoji:'🥬', originalPrice:6.50,  discountPrice:2.20,  expiryDate:daysFromToday(1), stock:7,  description:'Espinaca fresca en bolsa lista para cocinar.', active:true },
  { id:'o17', businessId:'b5', businessName:'Metro Surco',             name:'Gaseosa Inca Kola 2.25L',             category:'bebidas',    emoji:'🥤', originalPrice:9.00,  discountPrice:3.50,  expiryDate:daysFromToday(5), stock:14, description:'Inca Kola sabor original, tamaño familiar.', active:true },
  // Metro Jesús María
  { id:'o18', businessId:'b6', businessName:'Metro Jesús María',       name:'Uvas Red Globe (kg)',                 category:'frutas',     emoji:'🍇', originalPrice:9.00,  discountPrice:3.20,  expiryDate:daysFromToday(2), stock:8,  description:'Uvas rojas frescas y dulces.', active:true },
  { id:'o19', businessId:'b6', businessName:'Metro Jesús María',       name:'Pan Ciabatta Artesanal',              category:'panadería',  emoji:'🥖', originalPrice:7.50,  discountPrice:2.50,  expiryDate:daysFromToday(0), stock:5,  description:'Pan ciabatta artesanal horneado hoy.', active:true },
  { id:'o20', businessId:'b6', businessName:'Metro Jesús María',       name:'Crema de Leche Laive 200ml',          category:'lácteos',    emoji:'🥛', originalPrice:8.00,  discountPrice:3.00,  expiryDate:daysFromToday(1), stock:9,  description:'Crema de leche para cocinar y repostería.', active:true },
  // Wong La Molina
  { id:'o21', businessId:'b7', businessName:'Wong La Molina',          name:'Pollo a la Brasa Personal',           category:'restaurante',emoji:'🍗', originalPrice:32.00, discountPrice:14.00, expiryDate:daysFromToday(0), stock:3,  description:'Medio pollo a la brasa con papas fritas.', active:true },
  { id:'o22', businessId:'b7', businessName:'Wong La Molina',          name:'Sushi Mix 12 piezas',                 category:'restaurante',emoji:'🍱', originalPrice:38.00, discountPrice:16.00, expiryDate:daysFromToday(0), stock:2,  description:'12 piezas de sushi variado del día.', active:true },
  { id:'o23', businessId:'b7', businessName:'Wong La Molina',          name:'Papaya Arequipeña (kg)',              category:'frutas',     emoji:'🍈', originalPrice:6.00,  discountPrice:2.00,  expiryDate:daysFromToday(1), stock:10, description:'Papaya fresca de Arequipa, muy dulce.', active:true },
  // Wong Miraflores
  { id:'o24', businessId:'b8', businessName:'Wong Miraflores',         name:'Jamón del País Llanito 200g',         category:'carnes',     emoji:'🥩', originalPrice:14.00, discountPrice:5.00,  expiryDate:daysFromToday(1), stock:6,  description:'Jamón del país llanito en fetas.', active:true },
  { id:'o25', businessId:'b8', businessName:'Wong Miraflores',         name:'Torta de Chocolate 6 porciones',     category:'panadería',  emoji:'🎂', originalPrice:45.00, discountPrice:18.00, expiryDate:daysFromToday(0), stock:1,  description:'Torta de chocolate del día, 6 porciones.', active:true },
  { id:'o26', businessId:'b8', businessName:'Wong Miraflores',         name:'Agua San Luis 5L',                   category:'bebidas',    emoji:'💧', originalPrice:7.00,  discountPrice:2.50,  expiryDate:daysFromToday(10),stock:20, description:'Bidón de agua San Luis 5 litros.', active:true },
  // Mass Lince
  { id:'o27', businessId:'b9', businessName:'Mass Lince',              name:'Chicha Morada Inka Kola 500ml x6',   category:'bebidas',    emoji:'🍹', originalPrice:18.00, discountPrice:7.00,  expiryDate:daysFromToday(4), stock:8,  description:'6 botellas de chicha morada pequeñas.', active:true },
  { id:'o28', businessId:'b9', businessName:'Mass Lince',              name:'Galletas Oreo x3 packs',             category:'snacks',     emoji:'🍪', originalPrice:9.00,  discountPrice:3.50,  expiryDate:daysFromToday(3), stock:12, description:'Trio de packs de Oreo sabor original.', active:true },
  // Mass Callao
  { id:'o29', businessId:'b10',businessName:'Mass Callao',             name:'Aceitunas Negras Tarro 250g',        category:'verduras',   emoji:'🫒', originalPrice:10.00, discountPrice:3.90,  expiryDate:daysFromToday(2), stock:7,  description:'Aceitunas negras peruanas en conserva.', active:true },
  { id:'o30', businessId:'b10',businessName:'Mass Callao',             name:'Refresco Frugos Durazno 1L',         category:'bebidas',    emoji:'🍑', originalPrice:7.50,  discountPrice:2.80,  expiryDate:daysFromToday(2), stock:10, description:'Refresco Frugos sabor durazno.', active:true },
  // Tambo Barranco
  { id:'o31', businessId:'b11',businessName:'Tambo Barranco',          name:'Sandwich de Pollo Tambo',            category:'restaurante',emoji:'🥪', originalPrice:10.50, discountPrice:4.00,  expiryDate:daysFromToday(0), stock:4,  description:'Sandwich de pollo especial Tambo.', active:true },
  { id:'o32', businessId:'b11',businessName:'Tambo Barranco',          name:'Empanada de Carne x2',               category:'panadería',  emoji:'🥟', originalPrice:8.00,  discountPrice:3.00,  expiryDate:daysFromToday(0), stock:5,  description:'2 empanadas de carne horneadas.', active:true },
  // Tambo Magdalena
  { id:'o33', businessId:'b12',businessName:'Tambo Magdalena',         name:'Hot Dog + Papas Tambo',              category:'restaurante',emoji:'🌭', originalPrice:9.00,  discountPrice:3.50,  expiryDate:daysFromToday(0), stock:6,  description:'Combo hot dog con papas fritas.', active:true },
  // Tambo Los Olivos
  { id:'o34', businessId:'b13',businessName:'Tambo Los Olivos',        name:'Jugo Cifrut Naranja 500ml x4',       category:'bebidas',    emoji:'🥤', originalPrice:14.00, discountPrice:5.50,  expiryDate:daysFromToday(3), stock:10, description:'4 Cifrut naranja tamaño personal.', active:true },
  // Tambo San Miguel
  { id:'o35', businessId:'b14',businessName:'Tambo San Miguel',        name:'Yogurt Bebible Gloria 200g x6',      category:'lácteos',    emoji:'🥛', originalPrice:16.00, discountPrice:6.00,  expiryDate:daysFromToday(1), stock:7,  description:'6 yogurts bebibles sabor durazno.', active:true },
  // La Lucha
  { id:'o36', businessId:'b15',businessName:'La Lucha Sanguchería',    name:'Sanguche de Chicharrón',             category:'restaurante',emoji:'🥪', originalPrice:22.00, discountPrice:9.00,  expiryDate:daysFromToday(0), stock:3,  description:'Chicharrón con camote y criolla, del día.', active:true },
  { id:'o37', businessId:'b15',businessName:'La Lucha Sanguchería',    name:'Sanguche de Lomo Saltado',           category:'restaurante',emoji:'🥩', originalPrice:24.00, discountPrice:10.00, expiryDate:daysFromToday(0), stock:2,  description:'Lomo saltado en pan especial La Lucha.', active:true },
  // Bembos
  { id:'o38', businessId:'b16',businessName:'Bembos San Isidro',       name:'Combo Doble Bembos + Papas',         category:'restaurante',emoji:'🍔', originalPrice:35.00, discountPrice:14.00, expiryDate:daysFromToday(0), stock:4,  description:'Hamburguesa doble con papas medianas.', active:true },
  // Papa Johns
  { id:'o39', businessId:'b17',businessName:'Papa Johns Surco',        name:'Pizza Personal Pepperoni',           category:'restaurante',emoji:'🍕', originalPrice:28.00, discountPrice:12.00, expiryDate:daysFromToday(0), stock:3,  description:'Pizza personal de pepperoni recién hecha.', active:true },
  { id:'o40', businessId:'b17',businessName:'Papa Johns Surco',        name:'Garlic Knots x8',                   category:'panadería',  emoji:'🧄', originalPrice:14.00, discountPrice:5.50,  expiryDate:daysFromToday(0), stock:5,  description:'8 panecillos de ajo del día.', active:true },
  // El Rey
  { id:'o41', businessId:'b18',businessName:'Pollo El Rey San Borja',  name:'1/4 de Pollo a la Brasa + Papas',   category:'restaurante',emoji:'🍗', originalPrice:20.00, discountPrice:8.50,  expiryDate:daysFromToday(0), stock:6,  description:'Cuarto de pollo a la brasa con papas y ensalada.', active:true },
  // Panadería La Ideal
  { id:'o42', businessId:'b19',businessName:'Panadería La Ideal',      name:'Croissant de Mantequilla x4',       category:'panadería',  emoji:'🥐', originalPrice:16.00, discountPrice:6.00,  expiryDate:daysFromToday(0), stock:8,  description:'4 croissants de mantequilla del horno.', active:true },
  { id:'o43', businessId:'b19',businessName:'Panadería La Ideal',      name:'Torta Tres Leches (porción)',       category:'panadería',  emoji:'🍰', originalPrice:12.00, discountPrice:4.50,  expiryDate:daysFromToday(0), stock:4,  description:'Porción de torta tres leches artesanal.', active:true },
  { id:'o44', businessId:'b19',businessName:'Panadería La Ideal',      name:'Pan Francés Bolsa x10',             category:'panadería',  emoji:'🥖', originalPrice:5.00,  discountPrice:1.80,  expiryDate:daysFromToday(0), stock:15, description:'10 panes franceses del día.', active:true },
  // Starbucks
  { id:'o45', businessId:'b20',businessName:'Starbucks Miraflores',    name:'Frappuccino Caramelo Grande',       category:'bebidas',    emoji:'☕', originalPrice:22.00, discountPrice:9.00,  expiryDate:daysFromToday(0), stock:4,  description:'Frappuccino de caramelo tamaño grande.', active:true },
  { id:'o46', businessId:'b20',businessName:'Starbucks Miraflores',    name:'Muffin Arándanos + Café Americano', category:'panadería',  emoji:'🧁', originalPrice:18.00, discountPrice:7.00,  expiryDate:daysFromToday(0), stock:5,  description:'Combo muffin de arándanos con café americano.', active:true },
  // Panadería Alemana
  { id:'o47', businessId:'b21',businessName:'Panadería Alemana',       name:'Kuchen de Manzana (trozo)',         category:'panadería',  emoji:'🍏', originalPrice:14.00, discountPrice:5.50,  expiryDate:daysFromToday(0), stock:6,  description:'Trozo de kuchen de manzana artesanal alemán.', active:true },
  { id:'o48', businessId:'b21',businessName:'Panadería Alemana',       name:'Pan de Centeno 500g',               category:'panadería',  emoji:'🍞', originalPrice:12.00, discountPrice:4.50,  expiryDate:daysFromToday(1), stock:8,  description:'Pan de centeno integral, receta alemana.', active:true },
  // Don Mamino
  { id:'o49', businessId:'b22',businessName:'Don Mamino Surco',        name:'Sandwich Club + Café Latte',        category:'restaurante',emoji:'☕', originalPrice:28.00, discountPrice:11.00, expiryDate:daysFromToday(0), stock:3,  description:'Club sandwich con café latte mediano.', active:true },
  { id:'o50', businessId:'b22',businessName:'Don Mamino Surco',        name:'Cheesecake de Fresa (porción)',     category:'panadería',  emoji:'🍰', originalPrice:15.00, discountPrice:6.00,  expiryDate:daysFromToday(0), stock:4,  description:'Porción de cheesecake de fresa artesanal.', active:true },
];

function daysFromToday(n) {
  const d = new Date(); d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

// ─── STORAGE ─────────────────────────────────────────────────
const Store = {
  get:    (k, def=null) => { try { const v=localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set:    (k, v)        => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  remove: (k)           => { try { localStorage.removeItem(k); } catch {} },
};

// ─── SEED ────────────────────────────────────────────────────
function seedData() {
  // Force re-seed if version changed
  const VERSION = 'v6';
  if (Store.get('rf_seeded') !== VERSION) {
    Store.set('rf_businesses_public',   SEED_BUSINESSES);
    Store.set('rf_offers',              SEED_OFFERS);
    Store.set('rf_users',               Store.get('rf_users', []));
    Store.set('rf_businesses_accounts', Store.get('rf_businesses_accounts', []));
    Store.set('rf_reservations',        Store.get('rf_reservations', []));
    Store.set('rf_cart',                Store.get('rf_cart', []));
    Store.set('rf_favorites',           Store.get('rf_favorites', []));
    Store.set('rf_seeded', VERSION);
  }
}

// ─── AUTH ─────────────────────────────────────────────────────
const Auth = {
  getUser:       () => Store.get('rf_current_user'),
  getBusiness:   () => Store.get('rf_current_business'),
  isUser:        () => !!Store.get('rf_current_user'),
  isBusiness:    () => !!Store.get('rf_current_business'),
  logoutUser:    () => Store.remove('rf_current_user'),
  logoutBusiness:() => Store.remove('rf_current_business'),
};

// ─── UTILS ───────────────────────────────────────────────────
function formatCurrency(n)        { return `S/ ${Number(n).toFixed(2)}`; }
function discountPct(orig, disc)  { return Math.round((1 - disc/orig)*100); }
function escapeHTML(s)            { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function generateId()             { return '_'+Math.random().toString(36).substr(2,9); }
function debounce(fn, d)          { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),d); }; }

function expiryLabel(dateStr) {
  const today=new Date(); today.setHours(0,0,0,0);
  const diff=Math.round((new Date(dateStr+'T00:00:00')-today)/86400000);
  if(diff<0) return '⚠️ Vencido'; if(diff===0) return '⏰ Hoy'; if(diff===1) return '📅 Mañana';
  return `📅 ${diff}d`;
}
function expiryUrgency(dateStr) {
  const today=new Date(); today.setHours(0,0,0,0);
  const diff=Math.round((new Date(dateStr+'T00:00:00')-today)/86400000);
  return diff<=0?'danger':diff===1?'warning':'ok';
}
function formatCurrency(n) { return `S/ ${Number(n).toFixed(2)}`; }

// ─── TOAST ───────────────────────────────────────────────────
function showToast(message, type='success', duration=3000) {
  let c=document.getElementById('toast-container');
  if(!c){ c=document.createElement('div'); c.id='toast-container'; c.className='toast-container'; document.body.appendChild(c); }
  const icons={success:'✅',error:'❌',info:'ℹ️',warning:'⚠️'};
  const t=document.createElement('div'); t.className=`toast ${type}`;
  t.innerHTML=`<span>${icons[type]||'💬'}</span><span>${escapeHTML(message)}</span>`;
  c.appendChild(t);
  requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add('show')));
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),350); },duration);
}

// ─── MODAL ───────────────────────────────────────────────────
function openModal(id)  { const m=document.getElementById(id); if(m){ m.classList.add('show'); document.body.style.overflow='hidden'; } }
function closeModal(id) { const m=document.getElementById(id); if(m){ m.classList.remove('show'); document.body.style.overflow=''; } }
document.addEventListener('click', e=>{ if(e.target.classList.contains('modal-overlay')){ e.target.classList.remove('show'); document.body.style.overflow=''; } });

// ─── NAVBAR ──────────────────────────────────────────────────
function renderNavbar() {
  const user=Auth.getUser(), biz=Auth.getBusiness();
  const cart=Store.get('rf_cart',[]);
  const cartCount=cart.reduce((s,i)=>s+(i.qty||1),0);
  const badge=document.getElementById('cart-badge');
  if(badge){ badge.textContent=cartCount; badge.classList.toggle('show',cartCount>0); }

  // Theme toggle icon
  const themeBtn = document.getElementById('theme-toggle');
  if(themeBtn) themeBtn.textContent = Store.get('rf_theme','light')==='dark' ? '☀️' : '🌙';

  const authZone=document.getElementById('nav-auth-zone');
  if(!authZone) return;

  if(user) {
    const initials=(user.name||'U').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
    const avatarContent = user.photo ? '' : (user.avatar || initials);
    const avatarStyle = user.photo
      ? `background-image:url('${user.photo}');background-size:cover;background-position:center;`
      : (user.avatar?'font-size:1.1rem;background:var(--primary-light);color:var(--text-main);':'');
    authZone.innerHTML=`
      <div class="nav-user-menu" onclick="toggleUserDropdown()">
        <div class="nav-avatar" style="${avatarStyle}">${avatarContent}</div>
        <span class="nav-user-name">${escapeHTML(user.name.split(' ')[0])}</span>
        <span>▾</span>
      </div>
      <div id="user-dropdown" class="user-dropdown hidden">
        <a href="perfil.html">👤 Mi Perfil</a>
        <a href="favoritos.html">❤️ Favoritos</a>
        <a href="carrito.html">🛒 Mi Carrito</a>
        <a href="ranking.html">🏆 Mi Ranking</a>
        <a href="herramientas.html">🛠️ Herramientas</a>
        <hr><a href="#" onclick="logoutUser()">🚪 Cerrar Sesión</a>
      </div>`;
  } else if(biz) {
    authZone.innerHTML=`<a href="panel-negocio.html" class="btn btn-primary btn-sm">📊 Mi Panel</a><button class="btn btn-ghost btn-sm" onclick="logoutBusiness()">Salir</button>`;
  } else {
    authZone.innerHTML=`<a href="login.html" class="btn-nav-login">Ingresar</a><a href="registro.html" class="btn-nav-register">Registrarse</a>`;
  }

  // Scroll shadow effect
  window.addEventListener('scroll',()=>{
    const nav=document.querySelector('.navbar');
    if(nav) nav.classList.toggle('scrolled',window.scrollY>20);
  }, {passive:true});
}

function toggleUserDropdown() { document.getElementById('user-dropdown')?.classList.toggle('hidden'); }
document.addEventListener('click', e=>{ const dd=document.getElementById('user-dropdown'); if(dd&&!dd.classList.contains('hidden')&&!e.target.closest('.nav-user-menu')) dd.classList.add('hidden'); });
function logoutUser()     { Auth.logoutUser();     showToast('Sesión cerrada','info'); setTimeout(()=>window.location.href='index.html',800); }
function logoutBusiness() { Auth.logoutBusiness(); showToast('Sesión de negocio cerrada','info'); setTimeout(()=>window.location.href='index.html',800); }

function initHamburger() {
  const btn=document.getElementById('hamburger-btn'), menu=document.getElementById('mobile-menu');
  if(!btn||!menu) return;
  btn.addEventListener('click',()=>{ btn.classList.toggle('open'); menu.classList.toggle('open'); });
}
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  // Wait a tick for navbar.js to finish injecting
  requestAnimationFrame(() => {
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('active', href === path);
    });
  });
}

// ─── COUNTERS ─────────────────────────────────────────────────
function animateCounter(el, target, duration=1800, prefix='', suffix='') {
  let start=0; const step=target/(duration/16);
  const timer=setInterval(()=>{ start=Math.min(start+step,target); el.textContent=prefix+Math.floor(start).toLocaleString('es-PE')+suffix; if(start>=target) clearInterval(timer); },16);
}
function initCounters() {
  const els=document.querySelectorAll('[data-counter]'); if(!els.length) return;
  const obs=new IntersectionObserver(entries=>{ entries.forEach(e=>{ if(e.isIntersecting){ const el=e.target; animateCounter(el,parseFloat(el.dataset.counter),1800,el.dataset.prefix||'',el.dataset.suffix||''); obs.unobserve(el); } }); },{threshold:0.5});
  els.forEach(el=>obs.observe(el));
}
function initProgressBars() {
  const bars=document.querySelectorAll('.progress-fill[data-width]'); if(!bars.length) return;
  const obs=new IntersectionObserver(entries=>{ entries.forEach(e=>{ if(e.isIntersecting){ e.target.style.width=e.target.dataset.width+'%'; obs.unobserve(e.target); } }); },{threshold:0.3});
  bars.forEach(b=>obs.observe(b));
}
function initGlobalSearch() {
  const input=document.getElementById('global-search'); if(!input) return;
  input.addEventListener('input',debounce(e=>{ document.dispatchEvent(new CustomEvent('rf:search',{detail:{query:e.target.value.trim().toLowerCase()}})); },250));
}

// ─── OFFER CARD ───────────────────────────────────────────────
function renderOfferCard(offer, inCart=false, inFav=false) {
  const pct=discountPct(offer.originalPrice,offer.discountPrice);
  const urgency=expiryUrgency(offer.expiryDate);
  const expLabel=expiryLabel(offer.expiryDate);
  const border=urgency==='danger'?'border-color:#fde8e6':urgency==='warning'?'border-color:#fff3cc':'';
  return `
  <div class="offer-card fade-in" data-offer-id="${offer.id}" style="${border}">
    <div class="offer-card-img">
      <div class="no-img">${escapeHTML(offer.emoji||'🍱')}</div>
      <div class="discount-badge">-${pct}%</div>
      <div class="expiry-badge">${expLabel}</div>
      <button class="fav-btn ${inFav?'active':''}" onclick="toggleFavorite('${offer.id}',this)" title="Favorito">${inFav?'❤️':'🤍'}</button>
    </div>
    <div class="offer-card-body">
      <span class="offer-category">${escapeHTML(offer.category)}</span>
      <h3 class="offer-name">${escapeHTML(offer.name)}</h3>
      <p class="offer-business">📍 ${escapeHTML(offer.businessName)}</p>
      <div class="offer-prices">
        <span class="price-original">${formatCurrency(offer.originalPrice)}</span>
        <span class="price-discount">${formatCurrency(offer.discountPrice)}</span>
        <span class="price-save">Ahorra ${formatCurrency(offer.originalPrice-offer.discountPrice)}</span>
      </div>
    </div>
    <div class="offer-card-footer">
      <button class="btn-reserve ${inCart?'in-cart':''}" onclick="addToCart('${offer.id}')">
        ${inCart?'✅ En carrito':'🛒 Reservar'}
      </button>
      <button onclick="if(typeof shareOffer==='function')shareOffer(${JSON.stringify({id:offer.id,name:offer.name,businessName:offer.businessName,originalPrice:offer.originalPrice,discountPrice:offer.discountPrice,emoji:offer.emoji||'🍱'})})" style="width:100%;margin-top:.4rem;padding:.45rem;border-radius:var(--radius-sm);background:none;border:1.5px solid #25d366;color:#128c7e;font-size:.78rem;font-weight:600;cursor:pointer;transition:var(--transition);display:flex;align-items:center;justify-content:center;gap:.3rem;" onmouseover="this.style.background='#e8fdf0'" onmouseout="this.style.background='none'">
        📱 Compartir en WhatsApp
      </button>
    </div>
  </div>`;
}

// ─── CART ─────────────────────────────────────────────────────
function addToCart(offerId) {
  const user=Auth.getUser();
  if(!user){ showToast('Inicia sesión para reservar','warning'); setTimeout(()=>window.location.href='login.html',1200); return; }
  const offer=Store.get('rf_offers',[]).find(o=>o.id===offerId);
  if(!offer) return;
  let cart=Store.get('rf_cart',[]);
  if(cart.find(i=>i.offerId===offerId)){ showToast('Ya está en el carrito','info'); return; }
  cart.push({offerId,qty:1,name:offer.name,price:offer.discountPrice,businessName:offer.businessName,emoji:offer.emoji,addedAt:new Date().toISOString()});
  Store.set('rf_cart',cart);
  showToast(`"${offer.name}" añadido 🛒`,'success');
  const badge=document.getElementById('cart-badge');
  const total=cart.reduce((s,i)=>s+(i.qty||1),0);
  if(badge){ badge.textContent=total; badge.classList.add('show'); }
  const btn=document.querySelector(`.offer-card[data-offer-id="${offerId}"] .btn-reserve`);
  if(btn){ btn.textContent='✅ En carrito'; btn.classList.add('in-cart'); }
}

function toggleFavorite(offerId,btn) {
  if(!Auth.isUser()){ showToast('Inicia sesión para guardar favoritos','warning'); return; }
  let favs=Store.get('rf_favorites',[]);
  const idx=favs.indexOf(offerId);
  if(idx===-1){ favs.push(offerId); btn.textContent='❤️'; btn.classList.add('active'); showToast('Añadido a favoritos ❤️','success'); }
  else        { favs.splice(idx,1); btn.textContent='🤍'; btn.classList.remove('active'); showToast('Eliminado de favoritos','info'); }
  Store.set('rf_favorites',favs);
}

// ─── INIT ─────────────────────────────────────────────────────
/* =============================================
   INIT — single entry point
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Core
  seedData();
  initTheme();
  initReviews();

  // Navbar (rendered after navbar.js injects the HTML)
  renderNavbar();
  initHamburger();
  setActiveNavLink();
  renderNotifPanel();

  // Counters & UI
  initCounters();
  initProgressBars();
  initGlobalSearch();

  // PWA & Onboarding
  initPWA();
  setTimeout(checkOnboarding, 1000);
});


/* =============================================
   REFOOD v3 — DARK MODE
   ============================================= */
function initTheme() {
  const saved = Store.get('rf_theme', 'light');
  applyTheme(saved);
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  Store.set('rf_theme', theme);
  // Update all theme toggles on the page (navbar.js may inject one)
  document.querySelectorAll('#theme-toggle, .theme-toggle').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
}
function toggleTheme() {
  const current = Store.get('rf_theme', 'light');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

/* =============================================
   NOTIFICACIONES
   ============================================= */
const NOTIFICATIONS = [
  { id:'n1', icon:'⏰', text:'¡El Yogurt Gloria en Plaza Vea vence HOY! Quedan 3 unidades.', time:'Hace 5 min', unread:true, link:'ofertas.html' },
  { id:'n2', icon:'🔥', text:'Nueva oferta flash: Torta de Chocolate Wong Miraflores -60%.', time:'Hace 20 min', unread:true, link:'ofertas.html' },
  { id:'n3', icon:'✅', text:'Tu reserva #RF001A fue confirmada. Tienes 2h para recoger.', time:'Hace 1h', unread:false, link:'perfil.html' },
  { id:'n4', icon:'🌱', text:'¡Has rescatado 5 productos! Ganaste el badge "Rescatador Verde".', time:'Hace 2h', unread:false, link:'perfil.html' },
  { id:'n5', icon:'🏪', text:'Panadería La Ideal publicó 3 nuevas ofertas en Barranco.', time:'Hace 3h', unread:false, link:'ofertas.html' },
];

function renderNotifPanel() {
  const wrap = document.getElementById('notif-wrap');
  if (!wrap) return;
  const notifs = Store.get('rf_notifs', NOTIFICATIONS);
  const unread = notifs.filter(n => n.unread).length;
  const dot = document.getElementById('notif-dot');
  if (dot) { dot.textContent = unread; dot.classList.toggle('show', unread > 0); }
}

function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  const isOpen = panel.style.display === 'block';
  panel.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) renderNotifList();
}

function renderNotifList() {
  const list = document.getElementById('notif-list');
  if (!list) return;
  const notifs = Store.get('rf_notifs', NOTIFICATIONS);
  if (!notifs.length) { list.innerHTML = '<div class="notif-empty">🔔 Sin notificaciones</div>'; return; }
  list.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="markNotifRead('${n.id}','${n.link}')">
      <span class="notif-item-icon">${n.icon}</span>
      <div>
        <div class="notif-item-text">${escapeHTML(n.text)}</div>
        <div class="notif-item-time">${n.time}</div>
      </div>
    </div>`).join('');
}

function markNotifRead(id, link) {
  let notifs = Store.get('rf_notifs', NOTIFICATIONS);
  notifs = notifs.map(n => n.id === id ? {...n, unread:false} : n);
  Store.set('rf_notifs', notifs);
  renderNotifPanel();
  if (link) window.location.href = link;
}

function markAllRead() {
  let notifs = Store.get('rf_notifs', NOTIFICATIONS);
  notifs = notifs.map(n => ({...n, unread:false}));
  Store.set('rf_notifs', notifs);
  renderNotifPanel();
  renderNotifList();
}

document.addEventListener('click', e => {
  const panel = document.getElementById('notif-panel');
  const wrap  = document.getElementById('notif-wrap');
  if (panel && panel.style.display === 'block' && !wrap?.contains(e.target)) {
    panel.style.display = 'none';
  }
});

/* =============================================
   ONBOARDING
   ============================================= */
function checkOnboarding() {
  if (!Auth.isUser()) return;
  if (Store.get('rf_onboarded')) return;
  // Show only on index or ofertas
  const page = window.location.pathname.split('/').pop();
  if (!['index.html','ofertas.html',''].includes(page)) return;
  setTimeout(() => openOnboarding(), 1200);
}

function openOnboarding() {
  const overlay = document.getElementById('onboarding-overlay');
  if (overlay) { overlay.classList.add('show'); showObStep(0); }
}

function showObStep(idx) {
  document.querySelectorAll('.onboarding-step').forEach((s,i) => s.classList.toggle('active', i === idx));
  document.querySelectorAll('.ob-dot').forEach((d,i) => d.classList.toggle('active', i <= idx));
  const total = document.querySelectorAll('.onboarding-step').length;
  const nextBtn = document.getElementById('ob-next-btn');
  if (nextBtn) {
    nextBtn.textContent = idx === total - 1 ? '¡Empezar a rescatar! 🚀' : 'Siguiente →';
    nextBtn.onclick = () => idx === total - 1 ? finishOnboarding() : showObStep(idx + 1);
  }
}

function finishOnboarding() {
  Store.set('rf_onboarded', true);
  const overlay = document.getElementById('onboarding-overlay');
  if (overlay) overlay.classList.remove('show');
}

/* =============================================
   BADGES / GAMIFICACIÓN
   ============================================= */
const ALL_BADGES = [
  { id:'first',    icon:'🌱', name:'Primera Reserva',    desc:'Completa tu primera reserva',           req: r => r >= 1 },
  { id:'green5',   icon:'🍃', name:'Rescatador Verde',   desc:'Rescata 5 productos',                   req: r => r >= 5 },
  { id:'active15', icon:'🌿', name:'Rescatador Activo',  desc:'Rescata 15 productos',                  req: r => r >= 15 },
  { id:'expert30', icon:'🌳', name:'Rescatador Experto', desc:'Rescata 30 productos',                  req: r => r >= 30 },
  { id:'hero50',   icon:'🏆', name:'Héroe del Planeta',  desc:'Rescata 50 productos',                  req: r => r >= 50 },
  { id:'fav10',    icon:'❤️',  name:'Coleccionista',      desc:'Guarda 10 favoritos',                   req: (r,f) => f >= 10 },
  { id:'saver',    icon:'💰', name:'Super Ahorrador',    desc:'Ahorra más de S/ 50 en total',          req: (r,f,s) => s >= 50 },
  { id:'week',     icon:'📅', name:'Constante',          desc:'Haz reservas 3 días seguidos',          req: r => r >= 3 },
];

function getUserBadges(user) {
  if (!user) return [];
  const reservations = Store.get('rf_reservations',[]).filter(r => r.userId === user.id);
  const rescued = reservations.reduce((s,r) => s + (r.items||[]).reduce((ss,i) => ss + (i.qty||1), 0), 0);
  const favs    = Store.get('rf_favorites',[]).length;
  const saved   = reservations.reduce((s,r) => {
    const offers = Store.get('rf_offers',[]);
    return s + (r.items||[]).reduce((ss,i) => {
      const o = offers.find(x => x.id === i.offerId);
      return ss + (o ? (o.originalPrice - o.discountPrice) * (i.qty||1) : 0);
    }, 0);
  }, 0);
  return ALL_BADGES.map(b => ({ ...b, earned: b.req(rescued, favs, saved) }));
}

function renderBadges(containerId, user) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const badges = getUserBadges(user);
  container.innerHTML = badges.map(b => `
    <div class="badge-card ${b.earned ? 'earned' : ''}">
      <span class="badge-icon">${b.icon}</span>
      <div class="badge-name">${escapeHTML(b.name)}</div>
      <div class="badge-desc">${escapeHTML(b.desc)}</div>
    </div>`).join('');
}

/* =============================================
   SAVINGS TRACKER
   ============================================= */
function getUserSavings(userId) {
  const reservations = Store.get('rf_reservations',[]).filter(r => r.userId === userId);
  const offers = Store.get('rf_offers',[]);
  let totalSaved = 0, totalPaid = 0, totalOriginal = 0;
  reservations.forEach(r => {
    (r.items||[]).forEach(i => {
      const o = offers.find(x => x.id === i.offerId);
      if (o) {
        totalPaid     += o.discountPrice * (i.qty||1);
        totalOriginal += o.originalPrice * (i.qty||1);
        totalSaved    += (o.originalPrice - o.discountPrice) * (i.qty||1);
      }
    });
  });
  return { totalSaved, totalPaid, totalOriginal, count: reservations.length };
}

/* =============================================
   FLASH OFFERS — render
   ============================================= */
function renderFlashOffers(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const today = new Date().toISOString().split('T')[0];
  const offers = Store.get('rf_offers',[]).filter(o => o.active !== false && o.expiryDate === today);
  const cart   = Store.get('rf_cart',[]);
  const cartIds = cart.map(i => i.offerId);

  if (!offers.length) {
    container.closest('.flash-section')?.style.setProperty('display','none');
    return;
  }

  container.innerHTML = offers.slice(0,8).map(o => {
    const pct = discountPct(o.originalPrice, o.discountPrice);
    const inCart = cartIds.includes(o.id);
    return `
    <div class="flash-card">
      <div class="flash-emoji">${escapeHTML(o.emoji||'🍱')}</div>
      <div class="flash-name">${escapeHTML(o.name)}</div>
      <div class="flash-biz">📍 ${escapeHTML(o.businessName)}</div>
      <div class="flash-prices">
        <span class="flash-orig">${formatCurrency(o.originalPrice)}</span>
        <span class="flash-disc">${formatCurrency(o.discountPrice)}</span>
        <span class="flash-pct">-${pct}%</span>
      </div>
      <button class="flash-btn ${inCart?'in-cart':''}" onclick="addToCart('${o.id}')">
        ${inCart ? '✅ En carrito' : '⚡ Reservar ahora'}
      </button>
    </div>`;
  }).join('');
}

/* =============================================
   COUNTDOWN TIMER
   ============================================= */
function startCountdown(targetHour = 23, targetMin = 59) {
  function update() {
    const now  = new Date();
    const end  = new Date(); end.setHours(targetHour, targetMin, 59, 0);
    let diff   = Math.max(0, end - now);
    const h    = Math.floor(diff / 3600000); diff -= h * 3600000;
    const m    = Math.floor(diff / 60000);   diff -= m * 60000;
    const s    = Math.floor(diff / 1000);
    const fmt  = n => String(n).padStart(2,'0');
    const hEl  = document.getElementById('timer-h');
    const mEl  = document.getElementById('timer-m');
    const sEl  = document.getElementById('timer-s');
    if (hEl) hEl.textContent = fmt(h);
    if (mEl) mEl.textContent = fmt(m);
    if (sEl) sEl.textContent = fmt(s);
  }
  update();
  setInterval(update, 1000);
}

/* =============================================
   RATINGS
   ============================================= */
const SEED_REVIEWS = [
  { id:'r1', userId:'u1', userName:'María C.', bizId:'b1', bizName:'Plaza Vea San Isidro', rating:5, text:'Increíble plataforma. Ahorré S/ 45 en yogurts y pan. La calidad está perfecta.', date:'2024-12-01' },
  { id:'r2', userId:'u2', userName:'Jorge R.', bizId:'b3', bizName:'Tottus Miraflores',    rating:4, text:'Muy buena experiencia. El proceso de reserva es rapidísimo.', date:'2024-12-03' },
  { id:'r3', userId:'u3', userName:'Luis P.',  bizId:'b11',bizName:'Tambo Barranco',        rating:5, text:'Paso todos los días antes del trabajo. Súper conveniente y barato.', date:'2024-12-05' },
  { id:'r4', userId:'u4', userName:'Ana G.',   bizId:'b19',bizName:'Panadería La Ideal',    rating:5, text:'Los croissants estaban deliciosos. ¡Qué pena que se desperdiciaran antes!', date:'2024-12-07' },
  { id:'r5', userId:'u5', userName:'Carlos M.',bizId:'b7', bizName:'Wong La Molina',        rating:4, text:'El sushi estaba fresco y a mitad de precio. Volveré seguro.', date:'2024-12-09' },
  { id:'r6', userId:'u6', userName:'Sofía T.', bizId:'b20',bizName:'Starbucks Miraflores',  rating:5, text:'El frappuccino estaba perfecto y lo pagué menos de la mitad. ¡Genial!', date:'2024-12-10' },
];

function initReviews() {
  if (!Store.get('rf_reviews')) Store.set('rf_reviews', SEED_REVIEWS);
}

function getRatingStats(reviews) {
  if (!reviews.length) return { avg:0, counts:[0,0,0,0,0] };
  const counts = [0,0,0,0,0];
  reviews.forEach(r => { if(r.rating>=1&&r.rating<=5) counts[r.rating-1]++; });
  const avg = reviews.reduce((s,r) => s + r.rating, 0) / reviews.length;
  return { avg: avg.toFixed(1), counts: counts.reverse() }; // 5→1
}

function renderStars(rating, interactive=false, onRate=null) {
  const full = Math.floor(rating);
  return Array.from({length:5},(_,i) => {
    const filled = i < full ? 'filled' : '';
    const ev     = interactive ? `onclick="if(typeof ${onRate}==='function')${onRate}(${i+1})"` : '';
    return `<span class="star ${filled}" ${ev}>★</span>`;
  }).join('');
}

/* =============================================
   PWA — Service Worker + Install prompt
   ============================================= */
let deferredPrompt = null;

function initPWA() {
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  // Install prompt
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    // Show banner after 5s if not dismissed
    if (!Store.get('rf_pwa_dismissed')) {
      setTimeout(showPWABanner, 5000);
    }
  });
}

function showPWABanner() {
  let banner = document.getElementById('pwa-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'pwa-banner';
    banner.className = 'pwa-banner';
    banner.innerHTML = `
      <span class="pwa-icon">🌿</span>
      <div class="pwa-text">
        <div class="pwa-title">Instalar REFOOD PERÚ</div>
        <div class="pwa-sub">Accede más rápido desde tu pantalla de inicio</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="installPWA()">Instalar</button>
      <span class="pwa-close" onclick="dismissPWA()">✕</span>`;
    document.body.appendChild(banner);
  }
}

async function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  }
  dismissPWA();
}

function dismissPWA() {
  Store.set('rf_pwa_dismissed', true);
  document.getElementById('pwa-banner')?.remove();
}



/* =============================================
   REFERIDOS — Sistema de invitación
   ============================================= */
function generateReferralCode(userId) {
  return 'RF' + userId.slice(1,5).toUpperCase() + Math.random().toString(36).slice(2,5).toUpperCase();
}

function getUserReferralCode() {
  const user = Auth.getUser();
  if (!user) return null;
  let code = Store.get('rf_referral_' + user.id);
  if (!code) {
    code = generateReferralCode(user.id);
    Store.set('rf_referral_' + user.id, code);
  }
  return code;
}

function shareReferral() {
  const code = getUserReferralCode();
  if (!code) { showToast('Inicia sesión para obtener tu código', 'warning'); return; }
  const text = `🌿 *¡Únete a REFOOD PERÚ y empieza a ahorrar!*\n\n` +
    `Rescata alimentos próximos a vencer con hasta 70% de descuento en Lima.\n\n` +
    `📲 Regístrate gratis con mi código: *${code}*\n` +
    `👉 https://refoodperu.pe?ref=${code}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

function copyReferralCode() {
  const code = getUserReferralCode();
  if (!code) return;
  navigator.clipboard?.writeText(code).then(() => showToast(`Código copiado: ${code} 📋`, 'success'));
}

/* =============================================
   HEAT MAP — datos por distrito
   ============================================= */
function getDistrictActivity() {
  const reservations = Store.get('rf_reservations', []);
  const businesses   = Store.get('rf_businesses_public', []);
  const offers       = Store.get('rf_offers', []);

  const districtCounts = {};
  reservations.forEach(r => {
    (r.items||[]).forEach(item => {
      const offer = offers.find(o => o.id === item.offerId);
      if (!offer) return;
      const biz   = businesses.find(b => b.id === offer.businessId);
      const dist  = biz?.district || 'Otro';
      districtCounts[dist] = (districtCounts[dist]||0) + (item.qty||1);
    });
  });

  // Add demo data
  const demo = {
    'Miraflores':1240,'San Isidro':980,'Surco':870,'Barranco':650,
    'La Molina':540,'San Borja':490,'Lince':320,'Jesús María':285,
    'Magdalena':220,'San Miguel':195,'Los Olivos':160,'Callao':120
  };
  Object.entries(demo).forEach(([d,v]) => {
    districtCounts[d] = (districtCounts[d]||0) + v;
  });

  return districtCounts;
}

/* =============================================
   BUY AGAIN — comprar de nuevo
   ============================================= */
function buyAgain(reservationId) {
  const reservation = Store.get('rf_reservations',[]).find(r => r.id === reservationId);
  if (!reservation) return;
  const offers = Store.get('rf_offers',[]);
  let added = 0;
  reservation.items?.forEach(item => {
    const offer = offers.find(o => o.id === item.offerId && o.active !== false);
    if (offer) { addToCart(offer.id); added++; }
  });
  if (added > 0) showToast(`${added} producto${added>1?'s':''} añadido${added>1?'s':''} al carrito 🛒`, 'success');
  else showToast('Los productos de esta reserva ya no están disponibles', 'warning');
}

/* end of app.js */
