import React from "react";
import "../styles/AboutUs.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaLinkedin, FaGithub, FaInstagram, FaLightbulb, FaUniversalAccess, FaHandHoldingHeart, FaStar } from "react-icons/fa";


// Import images dynamically
import c1 from "../assets/AboutUs1.jpg";
import c2 from "../assets/AboutUs2.jpeg";
import c3 from "../assets/AboutUs3.jpg";
import c4 from "../assets/AboutUs4.jpeg";
import c6 from "../assets/lg.png";


// Image array for the carousel
const galleryImages = [c1, c2, c3, c4];

const AboutUs = () => {

  const coreValues = [
    {
      title: "Innovation",
      description: "Embracing technology to create dynamic and interactive learning experiences.",
      icon: <FaLightbulb className="core-value-icon" />,
    },
    {
      title: "Accessibility",
      description: "Ensuring every student has access to high-quality math education.",
      icon: <FaUniversalAccess className="core-value-icon" />,
    },
    {
      title: "Engagement",
      description: "Encouraging active participation through engaging content and tools.",
      icon: <FaHandHoldingHeart className="core-value-icon" />,
    },
    {
      title: "Excellence",
      description: "Striving for the highest standards in educational content and delivery.",
      icon: <FaStar className="core-value-icon" />,
    },
  ];
  return (
    <React.Fragment>
      {/* About Section */}
      <section className="about-section" data-aos="fade-up" data-aos-duration="1000">
        <div className="about-container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="about-heading">
                About Us
              </h2>
              <p className="about-description">
                Maths VLab is an interactive platform designed to help students
                learn mathematics through visual models, simulations, and
                engaging tools. It provides dynamic graphing, problem-solving
                resources, and video lectures to simplify complex concepts. Our
                goal is to make math learning intuitive and enjoyable for
                students of all levels. With a focus on innovation and
                accessibility, Maths VLab transforms traditional learning into an
                interactive experience.
              </p>
            </div>

            {/* SwiperJS Carousel */}
            <div className="about-gallery">
  <Swiper
    modules={[Navigation, Pagination, Autoplay]}
    spaceBetween={20}
    slidesPerView={1}
    navigation={true}
    pagination={{ clickable: true }}
    autoplay={{ delay: 3000, disableOnInteraction: false }}
    loop={true}
  >
    {galleryImages.map((img, index) => (
      <SwiperSlide key={index}>
        <img
          src={img}
          alt={`Gallery Image ${index + 1}`}
          loading="lazy"
          className="carousel-image"
        />
      </SwiperSlide>
    ))}
  </Swiper>
</div>

          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="story-section" >
        <div className="story-container"  data-aos="fade-up" data-aos-duration="1000">
          <div className="story-content">
            <h2 className="story-title">Our Story</h2>
            <p className="story-text">
              The inspiration for Maths VLab came from recognizing the
              challenges students face with traditional math education. Many
              learners struggle to grasp abstract mathematical concepts when
              taught through textbooks and lectures alone. We realized that
              interactive, visual models could bridge this gap and make learning
              more engaging and intuitive. Our motivation stemmed from a desire
              to modernize math education, making it more hands-on, accessible,
              and enjoyable for students of all levels.
            </p>
            <p>hi</p>
          </div>
          <div className="story-image">
            <img src={c4} alt="Our Story" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision-section" >
        <div className="vision-container" data-aos="fade-up" data-aos-duration="1000">
          <h2 className="vision-title">Vision</h2>
          <div className="vision-divider"></div>
          <p className="vision-text">
            To revolutionize mathematics education by making it interactive,
            engaging, and accessible for all students through visual learning
            tools and simulations.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="core-values-section" id="core-values" data-aos="fade-up" data-aos-duration="1000">
      <h2 className="core-values-heading">Core Values</h2>
      <div className="core-values-grid">
        {coreValues.map((value, index) => (
          <div className="core-value-item" key={index}>
            <div className="core-value-header">
              {value.icon}  {/* Displays the corresponding icon */}
              <h4 className="core-value-title">{value.title}</h4>
            </div>
            <p className="core-value-description">{value.description}</p>
          </div>
        ))}
      </div>
    </section>

      {/* Our Team Section */}
      <section className="team-section" >
        <h2  data-aos="fade-up" data-aos-duration="1000">Our Team</h2>
        <div className="team-container"  data-aos="fade-up" data-aos-duration="1000">
          {[
            { name: "Sujal Darji", role: "Software Engineer" },
          ].map((member, index) => (
            <div className="team-member" key={index}>
              <img src={c6} alt={member.name} loading="lazy" />
              <h5>{member.name}</h5>
              <h6>
                <i>{member.role}</i>
              </h6>
              <div className="social-icons">
                <a href="#"><i className="fa fa-facebook"><FaGithub size={32} /></i></a>
                <a href="#"><i className="fa fa-twitter"><FaInstagram size={30} /></i></a>
                <a href="#"><i className="fa fa-instagram"><FaLinkedin size={30} /></i></a>
                <a href="#"><i className="fa fa-linkedin"></i></a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </React.Fragment>
  );
};

export default AboutUs;
