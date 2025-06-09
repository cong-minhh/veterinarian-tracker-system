

using System.ComponentModel.DataAnnotations.Schema;

public abstract class AuditEntity
{

    [Column(TypeName = "datetime2")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	public string? CreatedBy { get; set; }

	public DateTime? UpdatedAt { get; set; }
	public string? UpdatedBy { get; set; }
}