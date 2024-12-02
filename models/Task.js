module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("Task", {
    task_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "in_progress", "completed"),
      allowNull: false,
      defaultValue: "pending",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });

  Task.associate = (models) => {
    Task.belongsTo(models.User, { foreignKey: "user_id" });
  };
  return Task;
};
