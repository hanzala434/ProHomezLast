import React from 'react'
import styles from './About.module.css';
import aboutimage1 from '../../assets/images/Sufyan-M-Sheikh-s-resume-Founder-Pro-Homez-page-001-scaled.jpeg'
import aboutimage2 from '../../assets/images/WhatsApp-Image-2024-01-13-at-1.57.22-PM-5-800x600.jpeg'
import aboutimage3 from '../../assets/images/257860893-800x600.jpeg'
import aboutimage4 from '../../assets/images/WhatsApp-Image-2023-08-08-at-1.38.20-PM-800x600.jpeg'

function About() {
  return (
    <div>
        <section className={styles.about1}>
            <div className={styles.about11}><img src={aboutimage1} alt="" /></div>
            <div className={styles.about12}><sub>Founder of ProHomez.com</sub>
            <h1>Mr. Sufyan M. Sheikh</h1>
            <p><strong>Mr. Sufyan Maqbool Sheikh</strong>, Founded the company <strong>“Pro Homez” in 2021 in Dubai, UAE</strong> with launching services in <strong>UAE and Pakistan</strong> simultaneously. He have vast experience of 10+ years with multinationals and in building startups based in USA, UK and Pakistan. He have extensively skills of digital marketing and business development.

With over a decade of experience, <strong>Mr. Sufyan M. Sheikh</strong> have done <strong>MBA in Marketing and communication</strong> and He is certified in <strong>Public Speaking</strong> and have numerous international certifications in <strong>Digital Marketing</strong> , that brings a wealth of knowledge and expertise to the table. Renowned for successfully founding startups in the USA and UK, he has honed his skills in digital marketing, business development, events and networking. He’s also the consultant of multiple IT, e-commerce, marketplace companies and startups.  This extensive background positions him as a trailblazer in the realm of startups, ensuring that Pro Homez is poised for unparalleled success around the world.

Beyond his digital acumen, <strong>Mr. Sufyan M. Sheikh</strong> is celebrated for his exceptional networking skills. Pro Homez is not merely a service provider; it’s a community. By fostering meaningful connections, both within the company and with clients.</p>
<span>Mr. Sheikh envisions Pro Homez as a trusted partner in every homeowner’s journey.</span>
<a href="https://www.linkedin.com/in/sufyansheikh" target='_blank'>Sufyan M. Sheikh’s LinkedIn profile</a>
            </div>
        </section>
        <section className={styles.about2}>
          <div className={styles.about21}>
            <img src={aboutimage2} alt="" />
            <h2>Home products vendors</h2>
            <p>Home products companies are available in Pro Homez including <span>Furniture, Marbles and Tiles, Paint, Home décor items, Sanitary items, Kitchen items, Electrical and Electronics 
              </span>, where people can select your favorite brand items and book, online.</p>
            <p>Vendors can open their online marketplace by uploading pictures of products to showcase around the world.  People can see and purchase the products, online. Vendors boost their sales 3x using Pro Homez marketing and sales dashboard.</p>
            <p><span>Click on “Become Pro Vendor” and follow the simple registration process.</span></p>
            <p><span>Personalize your dashboard with your brand name, logo, and product listings.</span></p>
            <p><span>Start showcasing and selling your home products to a global audience.</span></p>
          </div>
          <div className={styles.about21}>
            <img src={aboutimage3} alt="" />
            <h2>Homes, Apartments & Malls</h2>
            <p>Buy / Sell / Rent Homes, Apartments, Villa, Mansion or plots around the world</p>
            <p>Pro Homez giving you the facility to feature residential properties and connect directly with the clients using online technology in our property listing portal.</p>
            <p><span>Pro Homez offering you the platform for your residential project with marketing and sales to get national and International clientele.</span></p>
          </div>
          <div className={styles.about21}>
          <img src={aboutimage4} alt="" />
          <h2>Constructors and Interior Designers</h2>
          <p>Pro Homez offering you global, high standard team of Constructor/ Thakedar (مقاول)(ٹھیکیدار ) , Architect, Interior Designers, and Decorators to build and renovate your home and building with new technology standards and best quality services from designing to making your dream home into reality.</p>
          <p><span>Book the consultation with our team of 100+ global designers and start making your home</span></p>
          </div>
        </section>
        <section className={styles.about3}>
          <div className={styles.about31}>
            <h2>MISSION</h2>
            <p>Prohomez's mission is to provide innovative home and home products to the people around the world.</p>

          </div>
          <div className={styles.about31}>
            <h2>VISION</h2>
            <p>Prohomez's vision is connect people with real-estate and home products, globally using technology and advanced AI digital systems, Our vision includes showcasing creative interior designs and providing users the opportunity to explore the finest homes and designs globally. Seamless online booking options will empower individuals to transform their dreams into reality</p>
          </div>
        </section>
        <section className={styles.about4}>
          <h2>OUR VALUES</h2>
          <div className={styles.about41}>
            <div className={styles.about42}><h3>Our valued customers</h3><p>Pro Homez have customers across the world including families members of all generation who buy their desire homes and home products as per their need and demand, Pro Homez respect our valued customers and to fulfil their desires.</p></div>
            <div className={styles.about42}><h3>INNOVATION</h3><p>We innovate and bring new ideas and processes to the Homes and home product’s industry. Our clients view us as experts within a respected organization driving change and advancement in the Real-estate and Home products industry.</p></div>
          </div>
        </section>
    </div>
  )
}

export default About