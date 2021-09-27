const sequelize = require('sequelize');
class Product extends sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        name: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
      }
    );
  }
  static async createDummy() {
    await Product.create({
      name: '상품1',
      description: '상품1 설명',
      price: 1000,
    });
  }
}

module.exports = Product;
