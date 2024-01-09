import React from "react";

import styles from '../../styles/Home.module.css'

type MemoType = {
    address: string;
    name: string;
    timestamp: Date;
    message: string;
}

type MemosType = {
    memos: MemoType[];
}

const Memos: React.FC<MemosType> = ({ memos }) => {

    return (
        <>
            <h2>Memos received</h2>
            { memos.map((memo, idx) => (
                    <div key={idx} className={styles.memos}>
                        <p className={styles.memosp}>
                            &quot;{memo.message}&quot;
                        </p>
                        <p>From: {memo.name} at {memo.timestamp.toString()}</p>
                    </div>
                )
            )}
        </>
    );
};

export default Memos;
