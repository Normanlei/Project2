// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcryptjs");


module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
<<<<<<< HEAD
        first_name: {
=======
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
>>>>>>> master
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        // The password cannot be null
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        intro: {
            type: DataTypes.TEXT,
        },

        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },

        biddedProject: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        }
    });

    // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
    User.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };
    // Hooks are automatic methods that run during various phases of the User Model lifecycle
    // In this case, before a User is created, we will automatically hash their password
    User.addHook("beforeCreate", function (user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });


    // User.associate = function (models) {
    //     User.hasMany(models.Project)
    // };
    return User;
};
