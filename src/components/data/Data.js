import { getListCustom } from "../home/Service/Index";

export const navList = [
  {
    id: 1,
    path: "/",
    text: "Trang chủ",
  },
  {
    id: 2,
    path: "/client/about",
    text: "Giới thiệu",
  },
  // {
  //   id: 3,
  //   path: "/client/services",
  //   text: "Dịch vụ",
  // },
  {
    id: 4,
    path: "/client/rooms",
    text: "Phòng",
  },
  // {
  //   id: 5,
  //   path: "/page",
  //   text: "Trang",
  //   subItems: [
  //     {
  //       id: 51,
  //       path: "/client/booking",
  //       text: "Đặt phòng",
  //     },
  //     {
  //       id: 53,
  //       path: "/client/testimonial",
  //       text: "Lời chứng thực",
  //     },
  //   ],
  // },
  // {
  //   id: 6,
  //   path: "/client/contact",
  //   text: "Liên hệ",
  // },
];
export const socialIcons = [
  {
    icon: <i className="fab fa-facebook-f"></i>,
  },
  {
    icon: <i className="fab fa-twitter"></i>,
  },
  {
    icon: <i className="fab fa-instagram"></i>,
  },
  {
    icon: <i className="fab fa-linkedin-in"></i>,
  },
  {
    icon: <i className="fab fa-youtube"></i>,
  },
];

export const carouselData = [
  {
    img: "../assets/img/carousel-1.jpg",
    title: "Khám phá một khách sạn sang trọng",
    subtitle: "Cuộc sống xa hoa",
    btn1: "Phòng của chúng tôi",
    btn2: "Đặt phòng",
  },
  {
    img: "../assets/img/carousel-2.jpg",
    title: "Khám phá một khách sạn sang trọng",
    subtitle: "Cuộc sống xa hoa",
    btn1: "Phòng của chúng tôi",
    btn2: "Đặt phòng",
  },
];
export const about = [
  {
    icon: <i className="fa fa-hotel fa-2x text-orange mb-2"></i>,
    text: "Phòng",
    count: "7861",
  },
  {
    icon: <i className="fa fa-users fa-2x text-orange mb-2"></i>,
    text: "Nhân viên",
    count: "1234",
  },
  {
    icon: <i className="fa fa-users-cog fa-2x text-orange mb-2"></i>,
    text: "khách hàng",
    count: "4321",
  },
];

export const services = [
  {
    icon: <i className="fa fa-hotel fa-2x text-orange"></i>,
    name: "Rooms & Appartment",
    discription: "Contrary to popular belief, ipsum is not simply random.",
  },
  {
    icon: <i className="fa fa-utensils fa-2x text-orange"></i>,
    name: "Food & Restaurant",
    discription: "Contrary to popular belief, ipsum is not simply random.",
  },
  {
    icon: <i className="fa fa-spa fa-2x text-orange"></i>,
    name: "Spa & Fitness",
    discription: "Contrary to popular belief, ipsum is not simply random.",
  },

  {
    icon: <i className="fa fa-swimmer fa-2x text-orange"></i>,
    name: "Sports & Gaming",
    discription: "Contrary to popular belief, ipsum is not simply random.",
  },
  {
    icon: <i className="fa fa-glass-cheers fa-2x text-orange"></i>,
    name: "Event & Party",
    discription: "Contrary to popular belief, ipsum is not simply random.",
  },

  {
    icon: <i className="fa fa-dumbbell fa-2x text-orange"></i>,
    name: "GYM & Yoga",
    discription: "Contrary to popular belief, ipsum is not simply random.",
  },
];
export const team = [
  {
    image: "../assets/img/team-1.jpg",
    name: "Full Name",
    designation: "Designation",
  },
  {
    image: "../assets/img/team-2.jpg",
    name: "Full Name",
    designation: "Designation",
  },
  {
    image: "../assets/img/team-3.jpg",
    name: "Full Name",
    designation: "Designation",
  },
  {
    image: "../assets/img/team-3.jpg",
    name: "Full Name",
    designation: "Designation",
  },
];

export const footerItem = [
  {
    id: 1,
    header: "Công ty",
    UnitItem: [
      {
        name: "Giới thiệu",
      },
      {
        name: "Liên hệ",
      },
      {
        name: "Chính sách bảo mật",
      },
      {
        name: "Điều khoản và điều kiện",
      },
      {
        name: "Ủng hộ",
      },
    ],
  },
  {
    id: 2,
    header: "Dịch vụ",
    UnitItem: [
      {
        name: "Thực phẩm và nhà hàng",
      },
      {
        name: "Spa & thể dục",
      },
      {
        name: "Thể thao và trò chơi",
      },
      {
        name: "Tiệc và sự kiện",
      },
      {
        name: "GYM & Yoga",
      },
    ],
  },
];

export const footerContact = [
  {
    icon: <i className="fa fa-map-marker-alt me-3"></i>,
    name: "123 Street, HCM, VN",
  },
  {
    icon: <i className="fa fa-phone-alt me-3"></i>,
    name: "+012 345 67890",
  },
  {
    icon: <i className="fa fa-envelope me-3"></i>,
    name: "info@example.com",
  },
];

export const contact = [
  {
    icon: <i className="fa fa-envelope-open text-orange me-2"></i>,
    title: "Booking",
    email: "book@example.com",
  },
  {
    icon: <i className="fa fa-envelope-open text-orange me-2"></i>,
    title: "Technical",
    email: "tech@example.com",
  },
  {
    icon: <i className="fa fa-envelope-open text-orange me-2"></i>,
    title: "General",
    email: "info@example.com",
  },
];

export const testimonial = [
  {
    description:
      "Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet est kasd kasd et erat magna eos",
    name: "Client Name",
    profession: "",
    icon: (
      <i className="fa fa-quote-right fa-3x text-orange position-absolute end-0 bottom-0 me-4 mb-n1"></i>
    ),
    img: "../assets/img/testimonial-1.jpg",
  }
];
export const roomItems = [
  {
    img: "../assets/img/room-1.jpg",
    price: "$110/night",
    name: "Junior Suit",
    star: [
      <small className="fa fa-star text-orange"></small>,
      <small className="fa fa-star text-orange"></small>,
      <small className="fa fa-star text-orange"></small>,
      <small className="fa fa-star text-orange"></small>,
      <small className="fa fa-star text-orange"></small>,
    ],
    description:
      "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.",
    yellowbtn: "View Detail",
    darkbtn: "book now",
  },

  {
    img: "../assets/img/room-2.jpg",
    price: "$110/night",
    name: "Executive Suite",
    star: [
      <small className="fa fa-star text-orange"></small>,
      <small className="fa fa-star text-orange"></small>,
      <small className="fa fa-star text-orange"></small>,
      <small className="fa fa-star text-orange"></small>,
      <small className="fa fa-star text-orange"></small>,
    ],
    description:
      "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.",
    yellowbtn: "View Detail",
    darkbtn: "book now",
  },
  {
    img: "../assets/img/room-3.jpg",
    price: "$110/night",
    name: "Super Deluxe",
    star: [
      <small className="fa fa-star text-orange"></small>,
      <small className="fa fa-star text-orange"></small>,
      <small className="fa fa-star text-orange"></small>,
      <small className="fa fa-star text-orange"></small>,
      <small className="fa fa-star text-orange"></small>,
    ],
    description:
      "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.",
    yellowbtn: "View Detail",
    darkbtn: "book now",
  },
];

export const facility = [
  {
    icon: <i className="fa fa-bed text-orange me-2"></i>,
    quantity: 3,
    facility: "bed",
  },
  {
    icon: <i className="fa fa-bath text-orange me-2"></i>,
    quantity: 2,
    facility: "bath",
  },
  {
    icon: <i className="fa fa-wifi text-orange me-2"></i>,
    facility: "Wifi",
  },
];
