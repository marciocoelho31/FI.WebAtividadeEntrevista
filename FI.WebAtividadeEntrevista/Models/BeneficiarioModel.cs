using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAtividadeEntrevista.Models
{
    /// <summary>
    /// Classe de Modelo de Cliente
    /// </summary>
    public class BeneficiarioModel
    {
        public long Id { get; set; }
        
        /// <summary>
        /// Nome do beneficiário
        /// </summary>
        [Required]
        public string Nome { get; set; }

        /// <summary>
        /// CPF do beneficiário
        /// </summary>
        [Required]
        public string CPF { get; set; }

        /// <summary>
        /// Id do cliente
        /// </summary>
        public long IdCliente { get; set; }
    }
}