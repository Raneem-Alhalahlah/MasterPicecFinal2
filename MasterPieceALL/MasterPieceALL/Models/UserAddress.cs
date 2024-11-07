using System;
using System.Collections.Generic;

namespace MasterPieceALL.Models;

public partial class UserAddress
{
    public int AddressId { get; set; }

    public int UserId { get; set; }

    public string? Country { get; set; }

    public string? City { get; set; }

    public string? Street { get; set; }

    public string? PostalCode { get; set; }

    public virtual User User { get; set; } = null!;
}
