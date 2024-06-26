import {ResolumeAPI, WebSocketAPI, Composition} from "./resolume";
import {components} from "./schema";
import {ActionType} from "./ws";

export {WebSocketAPI, components, ActionType}

async function interactWithResolume() {

    const hostValue = "127.0.0.1";
    const portValue = 8080;
    const pathValue = "/path/to/local/files";

    const resolume: ResolumeAPI = new ResolumeAPI(hostValue, portValue, pathValue);

    let composition: Composition;
    try {
        composition = await resolume.getComposition();
    } catch (error) {
        console.log("Error connecting to Resolume:", error);
        return;
    }
    console.log("Composition is", composition);

    // Add a column
    await resolume.addColumn().catch((error) => {
        console.log(`Couldn't add column: ${error}`);
    });

    const resolumeWS = new WebSocketAPI(hostValue, portValue);
    resolumeWS.on("composition", (data: Composition) => {
        console.log("Composition is", data);
    })

}

interactWithResolume().then(() => {
    console.log("done");
})
