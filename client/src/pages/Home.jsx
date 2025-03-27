import React ,{ useState, useEffect } from "react";
import "../styles/home.css";
import Particles from "../components/ParticlesBackground";
import { features, categories, faqs, testimonials } from "../data/Home";


const LandingPage = () => {
  
  const [openIndex, setOpenIndex] = useState(null);
  
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };


    const [index, setIndex] = useState(0);
    const [pause, setPause] = useState(false);
  
    useEffect(() => {
      if (!pause) {
        const interval = setInterval(() => {
          setIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
      }
    }, [pause]);
    
    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
  };
  

  return (
    <>
    <div>
    <Particles />
      {/* Hero Section */}
      <div className="hero-section"  data-aos="fade-up" data-aos-duration="700">
        <div className="hero-content">
          <h1>Welcome to Maths VLab</h1>
          <p>
            Experience interactive mathematics learning through virtual simulations and tools.
            Make complex concepts simple and engaging.
          </p>
          <div className="buttons">
    <button className="btn primary" onClick={() => scrollToSection('categories')}>Get Started</button>
    <button className="btn secondary" onClick={() => scrollToSection('features')}>Learn More</button>
</div>
        </div>
        <div className="hero-animation">
          <div className="animation-placeholder">Animation Goes Here</div>
        </div>
      </div>

      {/* What is Maths VLab Section */}
      <section className="maths-vlab-section"  data-aos="fade-up" data-aos-duration="700">
        <div className="maths-vlab-container">
          <h2 className="maths-vlab-heading">What is Maths VLab?</h2>
          <p className="maths-vlab-text">
            Maths VLab is an interactive virtual mathematics laboratory designed to help
            students visualize and explore mathematical concepts. It provides simulations,
            graphing tools, and real-world applications to make learning math intuitive and engaging.
          </p>
        </div>
      </section>

       {/* Features Section */}
       <div className="feature-section"  data-aos="fade-up" data-aos-duration="700" id="features">
        <h2 className="feature-heading">Features</h2>
        {features.map((feature, index) => (
          <div key={index} className={`feature-card ${index % 2 === 0 ? "reverse-layout" : ""}`}>
            {/* Feature Name + Cube/Graph in One Container */}
            <div className="feature-box">
              <h3 className="feature-title">{feature.title}</h3>
              <div className="feature-graphic">
                {feature.type === "cube" ? (
                  <div className="cube-container">
                    <div className="perspective-1000">
                      <div className="cube">
                        <div className="cube-face cube-front"></div>
                        <div className="cube-face cube-back"></div>
                        <div className="cube-face cube-right"></div>
                        <div className="cube-face cube-left"></div>
                        <div className="cube-face cube-top"></div>
                        <div className="cube-face cube-bottom"></div>
                      </div>
                    </div>
                  </div>
                ) :  feature.type === "graph" ? (
                  <svg width="400" height="200" className="graph-svg">
                    <g className="grid-lines" stroke="#ffffff33" strokeWidth="0.5">
                      <line x1="0" y1="40" x2="400" y2="40"></line>
                      <line x1="0" y1="80" x2="400" y2="80"></line>
                      <line x1="0" y1="120" x2="400" y2="120"></line>
                      <line x1="0" y1="160" x2="400" y2="160"></line>
                    </g>
                    {/* Sample Graph */}
                    <polyline points="20,150 60,110 100,120 140,100 180,130 220,90 260,140 300,100 340,80 380,110" 
                      fill="none" stroke="yellow" strokeWidth="3" />
                    <polyline points="20,160 60,120 100,130 140,110 180,140 220,100 260,150 300,110 340,90 380,120" 
                      fill="none" stroke="cyan" strokeWidth="3" />
                    <polyline points="20,170 60,130 100,140 140,120 180,150 220,110 260,160 300,120 340,100 380,130" 
                      fill="none" stroke="red" strokeWidth="3" />
                    <text x="310" y="140" fill="yellow">Line 3</text>
                    <text x="310" y="160" fill="cyan">Line 2</text>
                    <text x="310" y="180" fill="red">Line 1</text>
                  </svg>
                ) : (
                    <div className="feature-image-container">
                    <img src={feature.image} alt={feature.title} />
                  </div> )}
              </div>
            </div>

            {/* Feature Description in Opposite Container */}
            <div className="feature-description-box">
              <p className="feature-description">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>



      <div>
  <h1 className="title" data-aos="fade-up" data-aos-duration="700" id="categories">
    Explore Categories
  </h1>
  <div className="categories-container" data-aos="fade-up" data-aos-duration="700">
    {categories.map((category, index) => (
      <a href="#" className="category-card" key={index}>
        <img src={category.image} alt={category.title} />
        <div className="card-content">
          <h2>{category.title}</h2>
          <p>{category.description}</p>
          <span className="explore-text">Explore {category.title} →</span> {/* ✅ Changed <a> to <span> */}
        </div>
      </a>
    ))}
  </div>
</div>

    <br/><br/><br/><br/>






    <section className="testimonial-section"  data-aos="fade-up" data-aos-duration="700">
    <h1 className="title">Testimonials</h1>
      <div
        className="testimonial-container"
        onMouseEnter={() => setPause(true)}
        onMouseLeave={() => setPause(false)}
      >
        <div className="testimonial-content active">
          <h3 className="testimonial-name">{testimonials[index].name}</h3>
          <p className="testimonial-designation">{testimonials[index].designation}</p>
          <p className="testimonial-review">"{testimonials[index].review}"</p>
        </div>

        <div className="testimonial-indicators">
          {testimonials.map((_, i) => (
            <div key={i} className={`dot ${index === i ? "active" : ""}`} onClick={() => setIndex(i)}></div>
          ))}
        </div>
      </div>
    </section>
    
    <section className="faq-section"  data-aos="fade-up" data-aos-duration="700">
  <div className="faq-container">
    <h2 className="faq-title">Frequently Asked Questions</h2>
    <p className="faq-subtitle">
      Find answers to common questions about Maths VLab
    </p>

    <div className="faq-list">
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <button className="faq-button" onClick={() => toggleFAQ(index)}>
            <span className="faq-question">{faq.question}</span>
            <span className={`faq-icon ${openIndex === index ? "open" : ""}`}>&#9662;</span>
          </button>
          
          {/* Ensure the answer is rendered properly */}
          {openIndex === index && (
            <div className="faq-answer">{faq.answer}</div>
          )}
        </div>
      ))}
    </div>
  </div>
</section>


</div>

    </>
  );
};

export default LandingPage;
