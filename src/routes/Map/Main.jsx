import { Html } from "@react-three/drei"
import { useState, Suspense } from "react"
import { MapModel } from "./Map"

export const Map = (props) => {
    return <Suspense>

        <Html
            style={{ pointerEvents: 'none' }}
            fullscreen>


        </Html>
        <ambientLight/>
    <MapModel/>
        {/* <CustomPlayer characterState={characterState} setCharacterState={setCharacterState} viewState={viewState} setViewState={setViewState} /> */}

    </Suspense>

}