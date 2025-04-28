import React from 'react';
import styles from '../style/FeatureSlider.module.css';
import Marquee from "react-fast-marquee";
import { vendors } from './data';
import { Feature } from './types';

const FeatureSlider: React.FC = () => {
  return (
    <>
      <div className={`container-fluid overflow-hidden ${styles.featureRow}`}>
        <div className="row">
            <div className={`col-md-2 d-flex align-items-center justify-content-center ${styles.featureHeadingCol}`}>
                <h3 className={`${styles.featureSliderHeading} mb-0`}>Our Pro Vendors</h3>
            </div>
            <div className="col-md-10">
                <Marquee speed={80}>
                    {vendors.map((item: Feature, index: number) => (
                        <h4 className={`${styles.featureSliderName} mb-0`} key={index}>{item.name}</h4>
                    ))}
                </Marquee>
            </div>
        </div>
      </div>
    </>
  );
}

export default FeatureSlider;
