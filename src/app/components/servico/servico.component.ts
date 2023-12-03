import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servico',
  templateUrl: './servico.component.html',
  styleUrls: ['./servico.component.scss'],
})
export class ServicoComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  servicos = [
    {
      icon: "./assets/veterinario1.png",
      title: "Clínica veterinária",
      color: "#EC8637"
    },
    {
      icon: "./assets/veterinario1.png",
      title: "Pet Shop",
      color: "#2499C4"
    },
    {
      icon: "./assets/veterinario1.png",
      title: "Clínica veterinária",
      color: "#D12F6E"
    },
    {
      icon: "./assets/veterinario1.png",
      title: "Clínica veterinária",
      color: "#01A291"
    }
  ];
  
}
