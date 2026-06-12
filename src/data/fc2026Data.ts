// fc2026Data.ts
// Real-world, precise financial cash flow dataset (Jan-Apr Realized, May-Dec Projected)
// Mapped exactly to the "FC 2026 — Colunas AL/AM" spreadsheet for Construtora JUST

export interface FCItem {
  label: string;
  section: string;
  is_saldo: boolean;
  is_total: boolean;
  orc: number[];
  real: number[];
  previsto: number;
  realizado_tot: number;
  sar: number;
}

export interface FCEntity {
  items: FCItem[];
  saldo_ant: number[];
  saldo_acum: number[];
  saldo_ini: number;
}

export const fc2026Data: {
  N_REAL: number;
  SD: Record<string, FCEntity>;
  CD: FCEntity;
  meta: {
    fechado_em: string;
    ultimo_mes: string;
    versao: string;
    n_real: number;
  };
} = {
  N_REAL: 5,
  meta: {
    fechado_em: "01/06/2026",
    ultimo_mes: "MAI",
    versao: "2026-04",
    n_real: 5
  },
  CD: {
    saldo_ini: 209905.07,
    saldo_ant: [209905.07, 665417.07, 380081.07, 114059.07, 19096.89, 128844.82, 1959102.82, 1527615.82, 1223872.82, 1344673.82, 822213.82, 169575.82],
    saldo_acum: [665417.07, 380081.07, 114059.07, 19096.89, 128844.82, 1959102.82, 1527615.82, 1223872.82, 1344673.82, 822213.82, 169575.82, -231051.18],
    items: [
      {
        label: "Administração",
        section: "ENTRADAS",
        is_saldo: false,
        is_total: false,
        orc: [1553357, 383427, 383427, 383427, 383427, 389406, 308601, 308601, 320601, 320601, 320601, 204359],
        real: [1065924, 164115, 476208, 259993.47, 253560.76, 0, 0, 0, 0, 0, 0, 0],
        previsto: 5259835,
        realizado_tot: 2219801.23,
        sar: 3040033.77
      },
      {
        label: "Travéza Residence",
        section: "ENTRADAS",
        is_saldo: false,
        is_total: false,
        orc: [720000, 229500, 322028, 232200, 535500, 234900, 541800, 235440, 548100, 0, 549360, 0],
        real: [0, 726840, 9204, 0.6, 123092.04, 0, 0, 0, 0, 0, 0, 0],
        previsto: 4148828,
        realizado_tot: 859136.64,
        sar: 3289691.36
      },
      {
        label: "Incoporações Entregues",
        section: "ENTRADAS",
        is_saldo: false,
        is_total: false,
        orc: [25077, 18807, 266121, 22484, 22358, 270899, 20777, 20107, 269563, 20068, 19531, 268112],
        real: [23636, 133932, 19855, 127330, 219494, 0, 0, 0, 0, 0, 0, 0],
        previsto: 1243902,
        realizado_tot: 524247,
        sar: 719655
      },
      {
        label: "Justcon",
        section: "ENTRADAS",
        is_saldo: false,
        is_total: false,
        orc: [0, 0, 0, 0, 0, 0, 100000, 0, 404135, 0, 0, 0],
        real: [0, 0, 0, 278596.45, 100000, 0, 0, 0, 0, 0, 0, 0],
        previsto: 504135,
        realizado_tot: 378596.45,
        sar: 125538.55
      },
      {
        label: "Justfix",
        section: "ENTRADAS",
        is_saldo: false,
        is_total: false,
        orc: [80785, 80785, 80785, 252047, 80785, 80785, 85532, 85532, 85532, 85532, 108163, 108163],
        real: [0, 3602, 5812, 4858.43, 251239.17, 0, 0, 0, 0, 0, 0, 0],
        previsto: 1214426,
        realizado_tot: 265511.6,
        sar: 948914.4
      },
      {
        label: "Obras de Terceiros",
        section: "ENTRADAS",
        is_saldo: false,
        is_total: false,
        orc: [0, 20031, 20031, 20031, 20031, 20031, 20031, 20031, 20031, 20031, 20031, 20031],
        real: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        previsto: 220338,
        realizado_tot: 0,
        sar: 220338
      },
      {
        label: "Empréstimos/Consórcios",
        section: "ENTRADAS",
        is_saldo: false,
        is_total: false,
        orc: [0, 0, 0, 0, 0, 2600000, 0, 0, 0, 0, 0, 0],
        real: [0, 0, 12179, 0, 800, 0, 0, 0, 0, 0, 0, 0],
        previsto: 2600000,
        realizado_tot: 12979,
        sar: 2587021
      },
      {
        label: "TOTAL DAS ENTRADAS",
        section: "ENTRADAS",
        is_saldo: false,
        is_total: true,
        orc: [2379219, 732550, 1072392, 910189, 1042101, 3596020, 1076740, 669710, 1647961, 446231, 1017686, 600665],
        real: [1089561, 1028489, 523258, 670778.95, 948185.97, 0, 0, 0, 0, 0, 0, 0],
        previsto: 15191464,
        realizado_tot: 4260272.92,
        sar: 10931191.08
      },
      {
        label: "Administração",
        section: "SAÍDAS",
        is_saldo: false,
        is_total: false,
        orc: [324188, 373076, 296930, 378095, 315575, 299582, 349553, 303978, 307044, 334960, 368061, 371699],
        real: [249173, 287953, 226281, 304244.68, 245921.84, 0, 0, 0, 0, 0, 0, 0],
        previsto: 4022741,
        realizado_tot: 1313573.52,
        sar: 2709167.48
      },
      {
        label: "Travéza Residence",
        section: "SAÍDAS",
        is_saldo: false,
        is_total: false,
        orc: [714453, 90616, 477365, 255059, 261052, 79041, 544080, 78432, 621646, 28310, 699088, 27401],
        real: [46970, 542110, 114330, 22617.01, 138474.79, 0, 0, 0, 0, 0, 0, 0],
        previsto: 3876545,
        realizado_tot: 864501.8,
        sar: 3012043.2
      },
      {
        label: "Incoporações Entregues",
        section: "SAÍDAS",
        is_saldo: false,
        is_total: false,
        orc: [7473, 4879, 16993, 20990, 5961, 18425, 20894, 5727, 18417, 21051, 5908, 18375],
        real: [0, 0, 7352, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        previsto: 165093,
        realizado_tot: 7352,
        sar: 157741
      },
      {
        label: "Justcon",
        section: "SAÍDAS",
        is_saldo: false,
        is_total: false,
        orc: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        real: [0, 0, 0, 5.53, 0, 0, 0, 0, 0, 0, 0, 0],
        previsto: 0,
        realizado_tot: 5.53,
        sar: -5.53
      },
      {
        label: "Justfix",
        section: "SAÍDAS",
        is_saldo: false,
        is_total: false,
        orc: [74217, 78135, 78135, 83661, 77974, 77974, 91927, 82555, 82555, 88577, 104399, 104399],
        real: [41765, 45228, 44174, 45615.5, 61304.83, 0, 0, 0, 0, 0, 0, 0],
        previsto: 1024509,
        realizado_tot: 238087.33,
        sar: 786421.67
      },
      {
        label: "Obras de Terceiros",
        section: "SAÍDAS",
        is_saldo: false,
        is_total: false,
        orc: [0, 0, 1332, 4409, 1332, 1332, 4409, 1332, 1332, 4409, 1332, 1332],
        real: [4378, 12391, 765, 1083, 6680.05, 0, 0, 0, 0, 0, 0, 0],
        previsto: 22551,
        realizado_tot: 25297.05,
        sar: -2746.05
      },
      {
        label: "Empréstimos/Consórcios",
        section: "SAÍDAS",
        is_saldo: false,
        is_total: false,
        orc: [285950, 449029, 416337, 427877, 428822, 1289408, 497365, 501428, 496165, 491384, 491535, 478087],
        real: [291763, 426142, 396378, 392175.41, 387529.9, 0, 0, 0, 0, 0, 0, 0],
        previsto: 6253388,
        realizado_tot: 1893988.31,
        sar: 4359399.69
      },
      {
        label: "TOTAL DAS SAÍDAS",
        section: "SAÍDAS",
        is_saldo: false,
        is_total: true,
        orc: [1406281, 995736, 1287092, 1170092, 1090716, 1765762, 1508227, 973453, 1527160, 968691, 1670324, 1001292],
        real: [634049, 1313825, 789280, 765741.13, 839911.41, 0, 0, 0, 0, 0, 0, 0],
        previsto: 15364826,
        realizado_tot: 4342806.54,
        sar: 11022019.46
      },
      {
        label: "SALDO ENTRADAS - SAÍDAS",
        section: "SAÍDAS",
        is_saldo: true,
        is_total: false,
        orc: [972938, -263187, -214700, -259903, -48615, 1830259, -431487, -303743, 120801, -522460, -652639, -400627],
        real: [455512, -285335, -266022, -94962.18, 108274.56, 0, 0, 0, 0, 0, 0, 0],
        previsto: -173362,
        realizado_tot: -82532.62,
        sar: -90829.38
      }
    ]
  },
  SD: {
    ADM: {
      saldo_ini: 209905.07,
      saldo_ant: [209905.07, 1026656.07, 902818.07, 1152745.07, 1108493.86, 1116132.78, 1205956.78, 1165004.78, 1169627.78, 1183184.78, 1168825.78, 1121365.78],
      saldo_acum: [1026656.07, 902818.07, 1152745.07, 1108493.86, 1116132.78, 1205956.78, 1165004.78, 1169627.78, 1183184.78, 1168825.78, 1121365.78, 954025.78],
      items: [
        {
          label: "Recebimento taxa Adm Matera",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: false,
          orc: [1029011, 169481, 169481, 169481, 169481, 169481, 169481, 169481, 169481, 169481, 169481, 169481],
          real: [983734, 96159, 135020, 176185.33, 211262.21, 0, 0, 0, 0, 0, 0, 0],
          previsto: 2893303,
          realizado_tot: 1602360.54,
          sar: 1290942.46
        },
        {
          label: "Recebimento taxa Adm , Neo",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: false,
          orc: [236731, 75726, 75726, 75726, 75726, 81705, 0, 0, 0, 0, 0, 0],
          real: [0, 50000, 333268, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          previsto: 621342,
          realizado_tot: 383268,
          sar: 238074
        },
        {
          label: "Recebimento taxa Adm, Blank",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: false,
          orc: [194122, 116242, 116242, 116242, 116242, 116242, 116242, 116242, 128242, 128242, 128242, 12000],
          real: [0, 0, 0, 75000, 15000, 0, 0, 0, 0, 0, 0, 0],
          previsto: 1404538,
          realizado_tot: 90000,
          sar: 1314538
        },
        {
          label: "Outros ADM",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: false,
          orc: [93493, 21978, 21978, 21978, 21978, 21978, 22878, 22878, 22878, 22878, 22878, 22878],
          real: [82190, 17956, 7920, 8808, 27298.55, 0, 0, 0, 0, 0, 0, 0],
          previsto: 340753,
          realizado_tot: 144172.55,
          sar: 196580.45
        },
        {
          label: "TOTAL DAS ENTRADAS",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: true,
          orc: [1553357, 383427, 383427, 383427, 383427, 389406, 308601, 308601, 320601, 320601, 320601, 204359],
          real: [1065924, 164115, 476208, 259993.47, 253560.76, 0, 0, 0, 0, 0, 0, 0],
          previsto: 5259835,
          realizado_tot: 2219801.23,
          sar: 3040033.77
        },
        {
          label: "Folha de pagamento",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [151438, 151438, 151438, 151438, 151438, 151438, 160524, 160524, 160524, 160524, 221257, 221257],
          real: [131023, 137497, 138108, 130843.74, 137998.65, 0, 0, 0, 0, 0, 0, 0],
          previsto: 1993235,
          realizado_tot: 675470.39,
          sar: 1317764.61
        },
        {
          label: "Impostos s/receita Taxa Adm",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [52779, 103298, 25498, 101601, 25498, 25498, 63821, 20522, 20522, 52080, 21320, 21320],
          real: [60621, 65242, 16318, 80318.42, 16773.94, 0, 0, 0, 0, 0, 0, 0],
          previsto: 533756,
          realizado_tot: 239273.36,
          sar: 294482.64
        },
        {
          label: "Despesas Operacionais ADM",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [119971, 118340, 119994, 125056, 138639, 122646, 125208, 122932, 125998, 122300, 125484, 129122],
          real: [57529, 85214, 71855, 93082.52, 91149.25, 0, 0, 0, 0, 0, 0, 0],
          previsto: 1495750,
          realizado_tot: 398829.77,
          sar: 1096920.23
        },
        {
          label: "TOTAL DAS SAÍDAS",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: true,
          orc: [324188, 373076, 296930, 378095, 315575, 299582, 349553, 303978, 307044, 334960, 368061, 371699],
          real: [249173, 287953, 226281, 304244.68, 245921.84, 0, 0, 0, 0, 0, 0, 0],
          previsto: 4022741,
          realizado_tot: 1313573.52,
          sar: 2709167.48
        },
        {
          label: "SALDO ENTRADAS - SAÍDAS",
          section: "SAÍDAS",
          is_saldo: true,
          is_total: false,
          orc: [1229169, 10351, 86497, 5333, 67852, 89824, -40952, 4623, 13556, -14359, -47460, -167340],
          real: [816751, -123838, 249927, -44251.21, 7638.92, 0, 0, 0, 0, 0, 0, 0],
          previsto: 1237095,
          realizado_tot: 906227.71,
          sar: 330867.29
        }
      ]
    },
    TRAVÉZA: {
      saldo_ini: 0,
      saldo_ant: [0, -46970, 137760, 32634, 10017.59, -5365.16, 150493.84, 148213.84, 305221.84, 231675.84, 203365.84, 53637.84],
      saldo_acum: [-46970, 137760, 32634, 10017.59, -5365.16, 150493.84, 148213.84, 305221.84, 231675.84, 203365.84, 53637.84, 26236.84],
      items: [
        {
          label: "Recebimento sobre Vendas",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: false,
          orc: [720000, 229500, 322028, 232200, 535500, 234900, 541800, 235440, 548100, 0, 549360, 0],
          real: [0, 720000, 0, 0, 105793.54, 0, 0, 0, 0, 0, 0, 0],
          previsto: 4148828,
          realizado_tot: 825793.54,
          sar: 3323034.46
        },
        {
          label: "Outros / Permutas / Aplicações",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: false,
          orc: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          real: [0, 6840, 9204, 0.6, 17298.5, 0, 0, 0, 0, 0, 0, 0],
          previsto: 0,
          realizado_tot: 33343.1,
          sar: -33343.1
        },
        {
          label: "TOTAL DAS ENTRADAS",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: true,
          orc: [720000, 229500, 322028, 232200, 535500, 234900, 541800, 235440, 548100, 0, 549360, 0],
          real: [0, 726840, 9204, 0.6, 123092.04, 0, 0, 0, 0, 0, 0, 0],
          previsto: 4148828,
          realizado_tot: 859136.64,
          sar: 3289691.36
        },
        {
          label: "Custos Diretos e Indiretos",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [23253, 19741, 468185, 19266, 15516, 14556, 14556, 13596, 10446, 6386, 6386, 5426],
          real: [46970, 25813, 25530, 22617.01, 138474.79, 0, 0, 0, 0, 0, 0, 0],
          previsto: 617317,
          realizado_tot: 259404.8,
          sar: 357912.2
        },
        {
          label: "Devolução Vendas - Unidades JUST",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [655200, 0, 0, 180342, 236248, 0, 520128, 0, 601782, 0, 692702, 0],
          real: [0, 487929, 60000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          previsto: 2886402,
          realizado_tot: 547929,
          sar: 2338473
        },
        {
          label: "Impostos / Comissões",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [36000, 70875, 9180, 55451, 9288, 64485, 9396, 64836, 9418, 21924, 0, 21974],
          real: [0, 28368, 28800, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          previsto: 372826,
          realizado_tot: 57168,
          sar: 315658
        },
        {
          label: "TOTAL DAS SAÍDAS",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: true,
          orc: [714453, 90616, 477365, 255059, 261052, 79041, 544080, 78432, 621646, 28310, 699088, 27401],
          real: [46970, 542110, 114330, 22617.01, 138474.79, 0, 0, 0, 0, 0, 0, 0],
          previsto: 3876545,
          realizado_tot: 864501.8,
          sar: 3012043.2
        },
        {
          label: "SALDO ENTRADAS - SAÍDAS",
          section: "SAÍDAS",
          is_saldo: true,
          is_total: false,
          orc: [5547, 138884, -155336, -22859, 274448, 155859, -2280, 157008, -73546, -28310, -149728, -27401],
          real: [-46969, 184731, -105126, -22616.41, -15382.75, 0, 0, 0, 0, 0, 0, 0],
          previsto: 272283,
          realizado_tot: -5363.16,
          sar: 277646.16
        }
      ]
    },
    "OBRAS ENTREGUES": {
      saldo_ini: 0,
      saldo_ant: [0, 23636, 157568, 170071, 297401, 516895, 769369, 769252, 783632, 1034778, 1033795, 1047418],
      saldo_acum: [23636, 157568, 170071, 297401, 516895, 769369, 769252, 783632, 1034778, 1033795, 1047418, 1297155],
      items: [
        {
          label: "Hotel Slaviero Vendas",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: false,
          orc: [0, 0, 250000, 0, 0, 250000, 0, 0, 250000, 0, 0, 250000],
          real: [0, 103000, 0, 100600, 205850, 0, 0, 0, 0, 0, 0, 0],
          previsto: 1000000,
          realizado_tot: 409450,
          sar: 590550
        },
        {
          label: "Hotel Slaviero pool",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: false,
          orc: [25077, 18807, 16121, 22484, 22358, 20899, 20777, 20107, 19563, 20068, 19531, 18112],
          real: [23636, 30932, 19855, 26730, 13644, 0, 0, 0, 0, 0, 0, 0],
          previsto: 243902,
          realizado_tot: 114797,
          sar: 129105
        },
        {
          label: "TOTAL DAS ENTRADAS",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: true,
          orc: [25077, 18807, 266121, 22484, 22358, 270899, 20777, 20107, 269563, 20068, 19531, 268112],
          real: [23636, 133932, 19855, 127330, 219494, 0, 0, 0, 0, 0, 0, 0],
          previsto: 1243902,
          realizado_tot: 524247,
          sar: 719655
        },
        {
          label: "Custos e Despesas Garantias",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [7473, 4879, 16993, 20990, 5961, 18425, 20894, 5727, 18417, 21051, 5908, 18375],
          real: [0, 0, 7352, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          previsto: 165093,
          realizado_tot: 7352,
          sar: 157741
        },
        {
          label: "TOTAL DAS SAÍDAS",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: true,
          orc: [7473, 4879, 16993, 20990, 5961, 18425, 20894, 5727, 18417, 21051, 5908, 18375],
          real: [0, 0, 7352, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          previsto: 165093,
          realizado_tot: 7352,
          sar: 157741
        },
        {
          label: "SALDO ENTRADAS - SAÍDAS",
          section: "SAÍDAS",
          is_saldo: true,
          is_total: false,
          orc: [17604, 13927, 249128, 1494, 16397, 252474, -117, 14380, 251146, -984, 13623, 249737],
          real: [23636, 133932, 12503, 127330, 219494, 0, 0, 0, 0, 0, 0, 0],
          previsto: 1078809,
          realizado_tot: 516895,
          sar: 561914
        }
      ]
    },
    JUSTCON: {
      saldo_ini: 0,
      saldo_ant: [0, 0, 0, 0, 278590.92, 378590.92, 378590.92, 478590.92, 478590.92, 882725.92, 882725.92, 882725.92],
      saldo_acum: [0, 0, 0, 278590.92, 378590.92, 378590.92, 478590.92, 478590.92, 882725.92, 882725.92, 882725.92, 882725.92],
      items: [
        {
          label: "Recebimento Lucros Cipriano",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: false,
          orc: [0, 0, 0, 0, 0, 0, 100000, 0, 404135, 0, 0, 0],
          real: [0, 0, 0, 278596.45, 100000, 0, 0, 0, 0, 0, 0, 0],
          previsto: 504135,
          realizado_tot: 378596.45,
          sar: 125538.55
        },
        {
          label: "TOTAL DAS ENTRADAS",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: true,
          orc: [0, 0, 0, 0, 0, 0, 100000, 0, 404135, 0, 0, 0],
          real: [0, 0, 0, 278596.45, 100000, 0, 0, 0, 0, 0, 0, 0],
          previsto: 504135,
          realizado_tot: 378596.45,
          sar: 125538.55
        },
        {
          label: "Aporte Capital Próprio",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          real: [0, 0, 0, 5.53, 0, 0, 0, 0, 0, 0, 0, 0],
          previsto: 0,
          realizado_tot: 5.53,
          sar: -5.53
        },
        {
          label: "TOTAL DAS SAÍDAS",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: true,
          orc: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          real: [0, 0, 0, 5.53, 0, 0, 0, 0, 0, 0, 0, 0],
          previsto: 0,
          realizado_tot: 5.53,
          sar: -5.53
        },
        {
          label: "SALDO ENTRADAS - SAÍDAS",
          section: "SAÍDAS",
          is_saldo: true,
          is_total: false,
          orc: [0, 0, 0, 0, 0, 0, 100000, 0, 404135, 0, 0, 0],
          real: [0, 0, 0, 278590.92, 100000, 0, 0, 0, 0, 0, 0, 0],
          previsto: 504135,
          realizado_tot: 378590.92,
          sar: 125544.08
        }
      ]
    },
    JUSTFIX: {
      saldo_ini: 0,
      saldo_ant: [0, -41765, -83391, -121753, -162510.07, 27424.27, 30235.27, 23840.27, 26817.27, 29794.27, 26749.27, 30513.27],
      saldo_acum: [-41765, -83391, -121753, -162510.07, 27424.27, 30235.27, 23840.27, 26817.27, 29794.27, 26749.27, 30513.27, 34277.27],
      items: [
        {
          label: "Prestação de Serviços",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: false,
          orc: [80785, 80785, 80785, 252047, 80785, 80785, 85532, 85532, 85532, 85532, 108163, 108163],
          real: [0, 3602, 3602, 4858.43, 251239.17, 0, 0, 0, 0, 0, 0, 0],
          previsto: 1214426,
          realizado_tot: 263301.6,
          sar: 951124.4
        },
        {
          label: "TOTAL DAS ENTRADAS",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: true,
          orc: [80785, 80785, 80785, 252047, 80785, 80785, 85532, 85532, 85532, 85532, 108163, 108163],
          real: [0, 3602, 5812, 4858.43, 251239.17, 0, 0, 0, 0, 0, 0, 0],
          previsto: 1214426,
          realizado_tot: 265511.6,
          sar: 948914.4
        },
        {
          label: "Folha e Encargos",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [30110, 30110, 30110, 30110, 30110, 30110, 31920, 31920, 31920, 31920, 42309, 42309],
          real: [27820, 24175, 24199, 28141.22, 26315.63, 0, 0, 0, 0, 0, 0, 0],
          previsto: 402017,
          realizado_tot: 130650.85,
          sar: 271366.15
        },
        {
          label: "Materiais e Outros",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [44107, 48025, 48025, 53551, 47864, 47864, 60007, 50635, 50635, 56657, 62090, 62090],
          real: [13945, 21053, 19975, 17474.28, 34989.2, 0, 0, 0, 0, 0, 0, 0],
          previsto: 622492,
          realizado_tot: 107436.48,
          sar: 515055.52
        },
        {
          label: "TOTAL DAS SAÍDAS",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: true,
          orc: [74217, 78135, 78135, 83661, 77974, 77974, 91927, 82555, 82555, 88577, 104399, 104399],
          real: [41765, 45228, 44174, 45615.5, 61304.83, 0, 0, 0, 0, 0, 0, 0],
          previsto: 1024509,
          realizado_tot: 238087.33,
          sar: 786421.67
        },
        {
          label: "SALDO ENTRADAS - SAÍDAS",
          section: "SAÍDAS",
          is_saldo: true,
          is_total: false,
          orc: [6568, 2650, 2650, 168386, 2811, 2811, -6395, 2977, 2977, -3045, 3764, 3764],
          real: [-41765, -41627, -38362, -40757.07, 189934.34, 0, 0, 0, 0, 0, 0, 0],
          previsto: 189917,
          realizado_tot: 27423.27,
          sar: 162493.73
        }
      ]
    },
    "OBRAS DE TERCEIROS": {
      saldo_ini: 0,
      saldo_ant: [0, -4378, -16769, -17534, -18617, -25297.05, -6598.05, 9023.95, 27722.95, 46421.95, 62043.95, 80742.95],
      saldo_acum: [-4378, -16769, -17534, -18617, -25297.05, -6598.05, 9023.95, 27722.95, 46421.95, 62043.95, 80742.95, 99441.95],
      items: [
        {
          label: "Obra Prestação Serviços",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: false,
          orc: [0, 20031, 20031, 20031, 20031, 20031, 20031, 20031, 20031, 20031, 20031, 20031],
          real: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          previsto: 220338,
          realizado_tot: 0,
          sar: 220338
        },
        {
          label: "TOTAL DAS ENTRADAS",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: true,
          orc: [0, 20031, 20031, 20031, 20031, 20031, 20031, 20031, 20031, 20031, 20031, 20031],
          real: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          previsto: 220338,
          realizado_tot: 0,
          sar: 220338
        },
        {
          label: "Despesas e Impostos",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [0, 0, 1332, 4409, 1332, 1332, 4409, 1332, 1332, 4409, 1332, 1332],
          real: [4378, 12391, 765, 1083, 6680.05, 0, 0, 0, 0, 0, 0, 0],
          previsto: 22551,
          realizado_tot: 25297.05,
          sar: -2746.05
        },
        {
          label: "TOTAL DAS SAÍDAS",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: true,
          orc: [0, 0, 1332, 4409, 1332, 1332, 4409, 1332, 1332, 4409, 1332, 1332],
          real: [4378, 12391, 765, 1083, 6680.05, 0, 0, 0, 0, 0, 0, 0],
          previsto: 22551,
          realizado_tot: 25297.05,
          sar: -2746.05
        },
        {
          label: "SALDO ENTRADAS - SAÍDAS",
          section: "SAÍDAS",
          is_saldo: true,
          is_total: false,
          orc: [0, 20031, 18699, 15622, 18699, 18699, 15622, 18699, 18699, 15622, 18699, 18699],
          real: [-4378, -12391, -765, -1083, -6680.05, 0, 0, 0, 0, 0, 0, 0],
          previsto: 197787,
          realizado_tot: -25297.05,
          sar: 223084.05
        }
      ]
    },
    EMPRÉSTIMOS: {
      saldo_ini: 0,
      saldo_ant: [0, -291763, -717905, -1102104, -1494279.41, -1881009.31, -570417.31, -1067782.31, -1569210.31, -2065375.31, -2556759.31, -3048294.31],
      saldo_acum: [-291763, -717905, -1102104, -1494279.41, -1881009.31, -570417.31, -1067782.31, -1569210.31, -2065375.31, -2556759.31, -3048294.31, -3526381.31],
      items: [
        {
          label: "Investidores Mútuos / Giro",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: false,
          orc: [0, 0, 0, 0, 0, 2600000, 0, 0, 0, 0, 0, 0],
          real: [0, 0, 12179, 0, 800, 0, 0, 0, 0, 0, 0, 0],
          previsto: 2600000,
          realizado_tot: 12979,
          sar: 2587021
        },
        {
          label: "TOTAL DAS ENTRADAS",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: true,
          orc: [0, 0, 0, 0, 0, 2600000, 0, 0, 0, 0, 0, 0],
          real: [0, 0, 12179, 0, 800, 0, 0, 0, 0, 0, 0, 0],
          previsto: 2600000,
          realizado_tot: 12979,
          sar: 2587021
        },
        {
          label: "Serviço da Dívida Safra / Bradesco / Sicoob",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [228947, 367157, 332467, 343997, 344347, 343046, 334661, 338726, 333463, 329063, 331932, 319484],
          real: [219775, 296088, 264258, 274872.98, 260271.3, 0, 0, 0, 0, 0, 0, 0],
          previsto: 3947470,
          realizado_tot: 1114990.28,
          sar: 2832479.72
        },
        {
          label: "Consórcios / Particular / Outros",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [57003, 81872, 83870, 83880, 84475, 946362, 162704, 162702, 162702, 162321, 159603, 158603],
          real: [71988, 130054, 132120, 117302.43, 127258.6, 0, 0, 0, 0, 0, 0, 0],
          previsto: 2305918,
          realizado_tot: 788998.03,
          sar: 1516919.97
        },
        {
          label: "TOTAL DAS SAÍDAS",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: true,
          orc: [285950, 449029, 416337, 427877, 428822, 1289408, 497365, 501428, 496165, 491384, 491535, 478087],
          real: [291763, 426142, 396378, 392175.41, 387529.9, 0, 0, 0, 0, 0, 0, 0],
          previsto: 6253388,
          realizado_tot: 1893988.31,
          sar: 4359399.69
        },
        {
          label: "SALDO ENTRADAS - SAÍDAS",
          section: "SAÍDAS",
          is_saldo: true,
          is_total: false,
          orc: [-285950, -449029, -416337, -427877, -428822, 1310592, -497365, -501428, -496165, -491384, -491535, -478087],
          real: [-291763, -426142, -384199, -392175.41, -386729.9, 0, 0, 0, 0, 0, 0, 0],
          previsto: -3653388,
          realizado_tot: -1881009.31,
          sar: -1772378.69
        }
      ]
    },
    MATERA: {
      saldo_ini: 5961820,
      saldo_ant: [5961820, 5252840, 5444818, 5853696, 5759229.23, 5160694.24, 4884652.24, 4495241.24, 4184876.24, 3847771.24, 3812027.24, 3432583.24],
      saldo_acum: [5252840, 5444818, 5853696, 5759229.23, 5160694.24, 4884652.24, 4495241.24, 4184876.24, 3847771.24, 3812027.24, 3432583.24, 3767639.24],
      items: [
        {
          label: "Vendas / Financiamento",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: false,
          orc: [666558, 1286001, 1540494, 1490694, 1357485, 1272916, 1155846, 1239251, 1226125, 1536193, 1213628, 1867021],
          real: [1162760, 1667012, 1923996, 4203766.05, 1605468.38, 0, 0, 0, 0, 0, 0, 0],
          previsto: 15852211,
          realizado_tot: 10385236.43,
          sar: 5466974.57
        },
        {
          label: "TOTAL DAS ENTRADAS",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: true,
          orc: [666558, 1286001, 1540494, 1490694, 1357485, 1272916, 1155846, 1239251, 1226125, 1536193, 1213628, 1867021],
          real: [1162760, 1667012, 2014618, 4203766.05, 1663086.49, 0, 0, 0, 0, 0, 0, 0],
          previsto: 15852211,
          realizado_tot: 10711242.54,
          sar: 5140968.46
        },
        {
          label: "Custos Diretos",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [1129874, 1129874, 1129874, 1129874, 1129874, 1129874, 1129874, 1129874, 1129874, 1129874, 1129874, 1129874],
          real: [670568, 941559, 1228629, 1470354.44, 1349742.98, 0, 0, 0, 0, 0, 0, 0],
          previsto: 13558491,
          realizado_tot: 5660853.42,
          sar: 7897637.58
        },
        {
          label: "Juros SFH / Taxa de Obra ADM",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [1104829, 251172, 261449, 271727, 282004, 292282, 302559, 312837, 323114, 333392, 343669, 353947],
          real: [1151571, 310860, 329592, 289720.21, 398541.54, 0, 0, 0, 0, 0, 0, 0],
          previsto: 4432977,
          realizado_tot: 2480284.75,
          sar: 1952692.25
        },
        {
          label: "Afac Devoluções / Distratos",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [72569, 198551, 176417, 139758, 132131, 126802, 112824, 106922, 116242, 108671, 119529, 48144],
          real: [49601, 222615, 47519, 2538158.17, 513336.96, 0, 0, 0, 0, 0, 0, 0],
          previsto: 1452543,
          realizado_tot: 3371230.13,
          sar: -1918687.13
        },
        {
          label: "TOTAL DAS SAÍDAS",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: true,
          orc: [2307272, 1579597, 1567740, 1541359, 1544009, 1548958, 1545257, 1549616, 1563230, 1571937, 1593072, 1531965],
          real: [1871740, 1475034, 1605740, 4298232.82, 2261621.48, 0, 0, 0, 0, 0, 0, 0],
          previsto: 19444011,
          realizado_tot: 11512368.3,
          sar: 7931642.7
        },
        {
          label: "SALDO ENTRADAS - SAÍDAS",
          section: "SAÍDAS",
          is_saldo: true,
          is_total: false,
          orc: [-1640715, -293595, -27245, -50665, -186524, -276042, -389411, -310365, -337105, -35744, -379445, 335056],
          real: [-708980, 191978, 408878, -94466.77, -598534.99, 0, 0, 0, 0, 0, 0, 0],
          previsto: -3591800,
          realizado_tot: -801125.76,
          sar: -2790674.24
        }
      ]
    },
    CIPRIANO: {
      saldo_ini: 53814,
      saldo_ant: [53814, 43717, 132972, 1378700, 345567.58, 134651.79, 163948.79, 247368.79, 202658.79, 214426.79, 178435.79, 175435.79],
      saldo_acum: [43717, 132972, 1378700, 345567.58, 134651.79, 163948.79, 247368.79, 202658.79, 214426.79, 178435.79, 175435.79, 172435.79],
      items: [
        {
          label: "Recebimento Vendas",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: false,
          orc: [0, 540084, 0, 666000, 810126, 549858, 999000, 0, 824787, 0, 0, 0],
          real: [3620000, 1150000, 1345000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          previsto: 4389855,
          realizado_tot: 6115000,
          sar: -1725145
        },
        {
          label: "TOTAL DAS ENTRADAS",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: true,
          orc: [26000, 566434, 21500, 666000, 825726, 555358, 999400, 0, 824787, 0, 0, 0],
          real: [3649329, 1205099, 1397919, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          previsto: 4485205,
          realizado_tot: 6252347,
          sar: -1767142
        },
        {
          label: "Devolução AFAC RB3 e JUST",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [0, 400000, 0, 500000, 800000, 400000, 887186, 0, 608270, 0, 0, 0],
          real: [1520000, 950000, 0, 978590.92, 200000, 0, 0, 0, 0, 0, 0, 0],
          previsto: 3595456,
          realizado_tot: 3648590.92,
          sar: -53134.92
        },
        {
          label: "Outras Despesas e Comissões",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [44425, 119037, 61528, 131325, 56440, 126061, 28794, 44710, 204749, 35991, 3000, 3000],
          real: [2139426, 165844, 152191, 54541.5, 10915.79, 0, 0, 0, 0, 0, 0, 0],
          previsto: 859060,
          realizado_tot: 2522918.29,
          sar: -1663858.29
        },
        {
          label: "TOTAL DAS SAÍDAS",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: true,
          orc: [44425, 519037, 61528, 631325, 856440, 526061, 915980, 44710, 813019, 35991, 3000, 3000],
          real: [3659426, 1115844, 152191, 1033132.42, 210915.79, 0, 0, 0, 0, 0, 0, 0],
          previsto: 4454516,
          realizado_tot: 6171509.21,
          sar: -1716993.21
        },
        {
          label: "SALDO ENTRADAS - SAÍDAS",
          section: "SAÍDAS",
          is_saldo: true,
          is_total: false,
          orc: [-18425, 47397, -40028, 34675, -30714, 29298, 83420, -44710, 11768, -35991, -3000, -3000],
          real: [-10097, 89255, 1245728, -1033132.42, -210915.79, 0, 0, 0, 0, 0, 0, 0],
          previsto: 30689,
          realizado_tot: 80838.79,
          sar: -50149.79
        }
      ]
    },
    NEO: {
      saldo_ini: 288899,
      saldo_ant: [288899, 1152122, 2844185, 2501751, 3689676.83, 2020986.03, 1961299.03, 1729238.03, 1660108.03, 1500001.03, 1405643.03, 1431997.03],
      saldo_acum: [1152122, 2844185, 2501751, 3689676.83, 2020986.03, 1961299.03, 1729238.03, 1660108.03, 1500001.03, 1405643.03, 1431997.03, 1408199.03],
      items: [
        {
          label: "Vendas e Receitas",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: false,
          orc: [1568925, 1246861, 1596640, 933593, 12225042, 681809, 712927, 861143, 771010, 885584, 690979, 689226],
          real: [1766753, 2872471, 1177343, 5858842.93, 3551958.6, 0, 0, 0, 0, 0, 0, 0],
          previsto: 22863740,
          realizado_tot: 15227368.53,
          sar: 7636371.47
        },
        {
          label: "TOTAL DAS ENTRADAS",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: true,
          orc: [1568925, 1246861, 1596640, 933593, 12225042, 681809, 712927, 861143, 771010, 885584, 690979, 689226],
          real: [1766753, 2872471, 1177343, 5858842.93, 3551958.6, 0, 0, 0, 0, 0, 0, 0],
          previsto: 22863740,
          realizado_tot: 15227368.53,
          sar: 7636371.47
        },
        {
          label: "Custo Direto Material / Mão-Obra",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [741574, 580569, 580569, 580569, 75726, 81705, 0, 0, 0, 0, 0, 0],
          real: [604605, 734125, 758412, 282678.81, 348553.78, 0, 0, 0, 0, 0, 0, 0],
          previsto: 2640714,
          realizado_tot: 2728373.59,
          sar: -87659.59
        },
        {
          label: "Devolução AFAC / Financiamento",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [0, 0, 0, 0, 12000000, 0, 750000, 750000, 750000, 800000, 500000, 600000],
          real: [0, 0, 284763, 4064382.78, 4545119.98, 0, 0, 0, 0, 0, 0, 0],
          previsto: 16150000,
          realizado_tot: 8894265.76,
          sar: 7255734.24
        },
        {
          label: "Outras Despesas e Impostos",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [431324, 574922, 500758, 518421, 484679, 659791, 194988, 180273, 181117, 179942, 164625, 113024],
          real: [298925, 446283, 476602, 323855.51, 326975.64, 0, 0, 0, 0, 0, 0, 0],
          previsto: 4183862,
          realizado_tot: 1872641.79,
          sar: 2311220.21
        },
        {
          label: "TOTAL DAS SAÍDAS",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: true,
          orc: [1172898, 1155491, 1081327, 1098990, 12560405, 741496, 944988, 930273, 931117, 979942, 664625, 713024],
          real: [903530, 1180408, 1519777, 4670917.1, 5220649.4, 0, 0, 0, 0, 0, 0, 0],
          previsto: 22974576,
          realizado_tot: 13495281.5,
          sar: 9479294.5
        },
        {
          label: "SALDO ENTRADAS - SAÍDAS",
          section: "SAÍDAS",
          is_saldo: true,
          is_total: false,
          orc: [396027, 91371, 515314, -165397, -335362, -59687, -232061, -69129, -160107, -94358, 26354, -23798],
          real: [863223, 1692063, -342434, 1187925.83, -1668690.8, 0, 0, 0, 0, 0, 0, 0],
          previsto: -110836,
          realizado_tot: 1732087.03,
          sar: -1842923.03
        }
      ]
    },
    BLANK: {
      saldo_ini: 948753,
      saldo_ant: [948753, 1012607, 560430, 674660, 507651.35, 661446.11, 643897.11, 655277.11, 650551.11, 650079.11, 644482.11, 1270793.11],
      saldo_acum: [1012607, 560430, 674660, 507651.35, 661446.11, 643897.11, 655277.11, 650551.11, 650079.11, 644482.11, 1270793.11, 971637.11],
      items: [
        {
          label: "Recebimentos sobre Vendas",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: false,
          orc: [1144083, 1096451, 1077465, 1117563, 1152488, 1116953, 1154634, 1269969, 1318429, 1311772, 1195498, 17167364],
          real: [1459854, 1132697, 1443121, 2507198.69, 1880259.76, 0, 0, 0, 0, 0, 0, 0],
          previsto: 30122669,
          realizado_tot: 8423131.45,
          sar: 21699537.55
        },
        {
          label: "TOTAL DAS ENTRADAS",
          section: "ENTRADAS",
          is_saldo: false,
          is_total: true,
          orc: [1144083, 1096451, 1077465, 1117563, 1152488, 1116953, 1154634, 1269969, 1318429, 1311772, 1195498, 17167364],
          real: [1499994, 1331390, 1485534, 2807198.69, 1903968.7, 0, 0, 0, 0, 0, 0, 0],
          previsto: 30122669,
          realizado_tot: 9028085.39,
          sar: 21094583.61
        },
        {
          label: "Custos Diretos",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [774944, 774944, 774944, 774944, 774944, 774944, 774944, 774944, 774944, 774944, 0, 0],
          real: [912913, 1520995, 858140, 1146086.11, 868210.7, 0, 0, 0, 0, 0, 0, 0],
          previsto: 7749441,
          realizado_tot: 5306344.81,
          sar: 2443096.19
        },
        {
          label: "Devolução AFAC / Financiamento",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [259470, 266991, 268871, 0, 0, 0, 0, 0, 0, 0, 0, 17000000],
          real: [259470, 172226, 268871, 1452500, 550000, 0, 0, 0, 0, 0, 0, 0],
          previsto: 17795331,
          realizado_tot: 2703067,
          sar: 15092264
        },
        {
          label: "Outras Despesas e Impostos",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: false,
          orc: [427920, 348138, 351558, 356292, 359713, 359558, 368310, 499751, 544013, 542425, 569187, 466520],
          real: [263757, 90346, 244293, 375621.23, 331963.24, 0, 0, 0, 0, 0, 0, 0],
          previsto: 5193329,
          realizado_tot: 1305980.47,
          sar: 3887348.53
        },
        {
          label: "TOTAL DAS SAÍDAS",
          section: "SAÍDAS",
          is_saldo: false,
          is_total: true,
          orc: [1462334, 1390073, 1395373, 1131236, 1134657, 1134502, 1143254, 1274695, 1318901, 1317369, 569187, 17466520],
          real: [1436140, 1783567, 1371304, 2974207.34, 1750173.94, 0, 0, 0, 0, 0, 0, 0],
          previsto: 30738101,
          realizado_tot: 9315392.28,
          sar: 21422708.72
        },
        {
          label: "SALDO ENTRADAS - SAÍDAS",
          section: "SAÍDAS",
          is_saldo: true,
          is_total: false,
          orc: [-318251, -293622, -317908, -13673, 17831, -17549, 11380, -4725, -472, -5597, 626311, -299156],
          real: [63854, -452177, 114230, -167008.65, 153794.76, 0, 0, 0, 0, 0, 0, 0],
          previsto: -615432,
          realizado_tot: -287306.89,
          sar: -328125.11
        }
      ]
    }
  }
};
