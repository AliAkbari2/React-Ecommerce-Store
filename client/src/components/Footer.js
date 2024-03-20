import React from "react";
import "../index.css";
//Footer component
//https://www.graphicpie.com/css-text-hover-effects/
//https://alvarotrigo.com/blog/website-footers/ 
const Footer = () => {
  return (
    <footer className="new_footer_area bg_color">
      <div className="new_footer_top">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div
                className="f_widget company_widget wow fadeInLeft"
                data-wow-delay="0.2s"
              >
                <h3 className="f-title f_600 t_color f_size_18">
                  Stay Connected
                </h3>
                <ul className="list-unstyled f_list">
                  <li>
                    Send us an email at marketing@keystor.com to <br />
                    subscribe for new releases and sales!
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div
                className="f_widget about-widget pl_70 wow fadeInLeft"
                data-wow-delay="0.4s"
              >
                <h3 className="f-title f_600 t_color f_size_18">KeyStor</h3>
                <ul className="list-unstyled f_list">
                  <li>
                    500 Crescent Heights <br /> Calgary, Alberta <br />
                    Canada
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div
                className="f_widget social-widget pl_70 wow fadeInLeft"
                data-wow-delay="0.8s"
              >
                <h3 className="f-title f_600 t_color f_size_18">
                  Connect With Us
                </h3>
                <div className="f_social_icon">
                  <a href="#" className="fab fa-facebook"></a>
                  <a href="#" className="fab fa-twitter"></a>
                  <a href="#" className="fab fa-linkedin"></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer_bg">
          <div className="footer_bg_one"></div>
          <div className="footer_bg_two"></div>
        </div>
      </div>
    </footer>
  );
};
//Footer component, exports footer HTML code 
export default Footer;
