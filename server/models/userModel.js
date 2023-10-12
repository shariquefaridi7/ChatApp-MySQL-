import { Sequelize } from "sequelize";
import { sequelize } from "../util/dbconfig.js";

export const userData = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    pic: {
        type: Sequelize.TEXT,
        defaultValue: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAABlBMVEXJycmcnJyshIZ4AAAB7ElEQVR4nO3bUW7DMAwEUfv+ly4SGEXQ2kksk1xqPXMCvj8BIpeFiIiIiIiIiIiIiIiIiKio9TX1MIOt+6nHOtcBYjbMB8YklC8UM1i+ZjSnnHL0lZxkdKUMMFpSBh3tJMOOXpILjFaUi442ksuOJpIARwtJiKOBJMihl7hAwhxiSaBDKgl1KCUukGCHThIOEUniHRpIgkMjcYGkOBQSIM0kWQ4g3RzVEiBApnPUSoAAAaJzVEqAAAECBAgQIECAzCopdAABAkQoKXUAATKfpNjhA7H5Q+RXtx3EZvPBB2KzHeSzr+WzQWez0+gDsdn79dnE9tmN94HY3I/4XPT43Fj5XL353CEuNpehi8+trs/19GJzz74MSNQDH2fCeGTCeGTCeOah2LJA/OZgICIioq35nygOr9+Phhk0JxCNMQOKhpZhRS/LRUYTSoCigyWMoaWEMnSUcIaGksIQUNIcRjvlhZRkR5UknVFEKXHkS4oY6ZRCR6qk1JEoKXakScodSRKBI0MiYSRQZI5gidARK3GBSB2BErEjTKJmrEESNeKZiyNCohZsuTguS9TjvwSkmeOSRD36n4CoB//X3SHqsXe6N0Q99G53hqhHPghIt1wc5yXqeQ+7K0Q97puAdOueEPWwbwPSLSDd2p34B3GsN/j6gvMWAAAAAElFTkSuQmCC"

    }
})