import React from 'react';
import './InfoBox.css';
import { Card, CardContent, Typography } from '@material-ui/core'

function InfoBox({ title, cases, isRed, isOrange, active, total, ...props }) {
    return (
        
        <Card 
        className={`infoBox ${active && 'infobox--selected'} ${isRed && "infoBox--red"} ${isOrange && "infoBox--orange"}`}
        onClick={props.onClick}
        >
            <CardContent>
                <Typography className="title" color="textSecondary">
                    <p className="infoBox__p">{title}</p>
                    
                </Typography>

                <h2 className={`infoBox__cases ${isOrange && "infoBox__cases--orange"} ${!isOrange && !isRed && "infoBox__cases--green"}`}>{cases}</h2>
                <Typography className="infoBox__total" color="textSecondary">
                    <p className="infoBox__p">{total} Total</p>
                </Typography>
            </CardContent>
        </Card>
        
    )
}

export default InfoBox
