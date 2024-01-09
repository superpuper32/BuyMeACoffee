import React from "react";
import styles from '../../styles/Home.module.css'

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <a
                href="https://alchemy.com/?a=roadtoweb3weektwo"
                target="_blank"
                rel="noopener noreferrer"
            >
                Refactored by @superpuper32 from Alchemy&apos;s Road to Web3!
            </a>
        </footer>
    );
}

export default Footer;
