﻿using System;
using System.Collections.Generic;

namespace MasterPieceALL.Models;

public partial class Product
{
    public int ProductId { get; set; }

    public int? CategoryId { get; set; }

    public string? ProductImage1 { get; set; }

    public string? ProductImage2 { get; set; }

    public string? ProductImage3 { get; set; }

    public string? ProductImage4 { get; set; }

    public string? ProductImage5 { get; set; }

    public string? ProductImage6 { get; set; }

    public bool? Visiblity { get; set; }

    public string? ProductName { get; set; }

    public string? Description { get; set; }

    public string? Color { get; set; }

    public decimal? Price { get; set; }

    public int? StockQuantity { get; set; }

    public decimal? DiscountPercentage { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? ColorId { get; set; }

    public int? RatingCount { get; set; }

    public int? RatingTotal { get; set; }

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public virtual Category? Category { get; set; }

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
