const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "123456",
      },
      role: {
        type: DataTypes.ENUM("admin", "user", "moderator"),
        allowNull: false,
        defaultValue: "user",
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password === "123456") {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeSave: async (user) => {
          if (user.password === "123456") {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Task, { foreignKey: "user_id", onDelete: "CASCADE" });
  };

  return User;
};
