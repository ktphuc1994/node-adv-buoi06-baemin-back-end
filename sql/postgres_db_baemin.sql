create table banner (
	banner_id SERIAL primary key,
	name varchar(100) not null,
	image varchar(255) not null,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE shipping_partner (
    partner_id SERIAL PRIMARY KEY,
    partner_name VARCHAR(255) NOT NULL,
    service_fee DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

create table shipping_method (
	method_id SERIAL primary key,
	shipping_name VARCHAR(255) not null,
    shipping_price INT not null,
    shipping_time VARCHAR(100) not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

create table shipping_partner_method (
    partner_id INT NOT NULL,
    method_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (partner_id, method_id),
    CONSTRAINT fk_partner_method_relation FOREIGN KEY (partner_id) REFERENCES shipping_partner(partner_id),
    CONSTRAINT fk_method_partner_relation FOREIGN KEY (method_id) REFERENCES shipping_method(method_id)
);

CREATE TABLE store (
    store_id SERIAL PRIMARY KEY,
    address TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    open_hour TIME,
    close_hour TIME,
    price_range VARCHAR(50),
    rating DECIMAL(3, 2),
    total_rating INT,
    partner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_partner FOREIGN KEY (partner_id) REFERENCES shipping_partner(partner_id)
);

CREATE TABLE food (
    food_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    description VARCHAR(255),
    image VARCHAR(255),
    store_id INT NOT NULL,
    tags VARCHAR(50)[] DEFAULT '{}',
    stock int not null default 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_store FOREIGN KEY (store_id) REFERENCES store(store_id)
);

CREATE TABLE menu (
    menu_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE menu_food (
    menu_id INT NOT NULL,
    food_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (menu_id, food_id),
    CONSTRAINT fk_menu FOREIGN KEY (menu_id) REFERENCES menu(menu_id),
    CONSTRAINT fk_food FOREIGN KEY (food_id) REFERENCES food(food_id)
);

CREATE TABLE cart (
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (user_id, food_id),
    CONSTRAINT fk_user_cart FOREIGN KEY (user_id) REFERENCES "user"(user_id),
    CONSTRAINT fk_food_cart FOREIGN KEY (food_id) REFERENCES food(food_id)
);

CREATE TABLE address (
    address_id SERIAL PRIMARY KEY,
    full_address TEXT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);

CREATE TABLE voucher (
    voucher_id SERIAL PRIMARY KEY,
    percentage DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE "order" (
    order_id SERIAL PRIMARY KEY,
    address_id INT NOT NULL,
    user_id INT NOT NULL,
    voucher_id INT,
    store_id INT not null,
    method_id INT not null,
    message TEXT,
    payment_method VARCHAR(50),
    total_discount INT DEFAULT 0,
    service_fee INT DEFAULT 0,
    shipping_price INT not null,
    status VARCHAR(50) not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_user_order FOREIGN KEY (user_id) REFERENCES "user"(user_id),
    CONSTRAINT fk_address_order FOREIGN KEY (address_id) REFERENCES address(address_id),
    CONSTRAINT fk_voucher_order FOREIGN KEY (voucher_id) REFERENCES voucher(voucher_id),
    CONSTRAINT fk_store_order FOREIGN KEY (store_id) REFERENCES store(store_id),
    CONSTRAINT fk_method_order FOREIGN KEY (method_id) REFERENCES shipping_method(method_id)
);

CREATE TABLE order_food (
    order_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_time_of_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (order_id, food_id),
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES "order"(order_id),
    CONSTRAINT fk_food_order FOREIGN KEY (food_id) REFERENCES food(food_id)
);

